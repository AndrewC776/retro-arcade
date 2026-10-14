import { AudioManager } from "@/2026/audio";
import { ParticleSystem } from "@/2026/particles";
import type { Marble } from "@/2026/types/marble";
import { toArray } from "@/common/array";
import { createCanvas } from "@/common/domCanvas";
import { combination, max, min, totalForce } from "@/common/math";
import type { MixedHsl } from "@/common/types/color";
import type { Game } from "@/common/types/game";

export class OhajikiGame implements Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private marbles: Marble[] = [];
  private score: number = 0;
  private isDragging: boolean = false;
  private draggedMarble: Marble | null = null;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private dragAimX: number = 0;
  private dragAimY: number = 0;
  private boardRadius: number = 0;
  private centerX: number = 0;
  private centerY: number = 0;
  private audioManager: AudioManager;
  private particleSystem: ParticleSystem;

  constructor(marbleCount: number) {
    this.audioManager = new AudioManager();
    this.particleSystem = new ParticleSystem();
    const canvas = createCanvas();
    this.canvas = canvas;
    if (!this.canvas.parentElement) {
      document.body.appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext("2d")!;

    const resizeCanvas = (canvas: HTMLCanvasElement): void => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.centerX = canvas.width / 2;
      this.centerY = canvas.height / 2;
      this.boardRadius = min(canvas.width, canvas.height) * 0.35;
    };
    resizeCanvas(canvas);
    window.addEventListener("resize", () => resizeCanvas(canvas));

    this.setupInput();
    this.initGame(marbleCount);

    this.audioManager.playBGM();
  }

  private initGame(marbleCount: number): void {
    const templateMarble = {
      isActive: true,
      radius: 12,
      vx: 0,
      vy: 0,
      x: 0,
      y: 0,
    };

    const marbleColors = [
      "hsl(0 0 100)",
      "hsl(0 100 50)",
      "hsl(60 100 50)",
      "hsl(240 100 50)",
    ] as const;
    this.marbles = toArray(marbleCount).map((_, i) => {
      const angle = (i / marbleCount) * Math.PI * 2;
      const aaa = this.boardRadius * 0.5;
      const x = this.centerX + Math.cos(angle) * aaa;
      const y = this.centerY + Math.sin(angle) * aaa;
      const originalColor = marbleColors[i % marbleColors.length];
      return {
        ...templateMarble,
        color: originalColor,
        isPlayer: false,
        originalColor,
        originalX: x,
        originalY: y,
        x,
        y,
      };
    });
  }

  private setupInput(): void {
    this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
    window.addEventListener("mousemove", (e) => this.onMouseMove(e));
    window.addEventListener("mouseup", () => this.onMouseUp());
    this.canvas.addEventListener("touchstart", (e) => this.onTouchStart(e));
    window.addEventListener("touchmove", (e) => this.onTouchMove(e));
    window.addEventListener("touchend", () => this.onTouchEnd());
  }

  private getMarbleAtPoint(x: number, y: number): Marble | null {
    for (const marble of this.marbles) {
      if (!marble.isActive) {
        continue;
      }
      const dx = x - marble.x,
        dy = y - marble.y,
        dist = totalForce(dx, dy);
      if (dist <= marble.radius) {
        return marble;
      }
    }
    return null;
  }

  private respawnMarble(marble: Marble): Marble {
    return {
      ...marble,
      color: marble.originalColor,
      isActive: true,
      vx: 0,
      vy: 0,
      x: marble.originalX,
      y: marble.originalY,
    };
  }

  private onMouseDown(e: MouseEvent): void {
    this.audioManager.resume();
    const marble = this.getMarbleAtPoint(e.clientX, e.clientY);
    if (!marble || marble.vx ** 2 + marble.vy ** 2 > 1) {
      return;
    }
    this.draggedMarble = marble;
    this.isDragging = true;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.dragAimX = e.clientX;
    this.dragAimY = e.clientY;
  }

  private onMouseMove(e: MouseEvent): void {
    if (this.isDragging) {
      this.dragAimX = e.clientX;
      this.dragAimY = e.clientY;
    }
  }

  private onMouseUp(): void {
    if (!this.isDragging || !this.draggedMarble) {
      return;
    }
    this.isDragging = false;

    const dx = this.dragStartX - this.dragAimX,
      dy = this.dragStartY - this.dragAimY,
      dist = totalForce(dx, dy),
      aaa = max(dist, 1),
      force = min(dist / 50, 8);

    this.draggedMarble.vx = (dx / aaa) * force;
    this.draggedMarble.vy = (dy / aaa) * force;
    this.draggedMarble = null;
  }

  private onTouchStart(e: TouchEvent): void {
    this.audioManager.resume();
    const touch = e.touches[0],
      marble = this.getMarbleAtPoint(touch.clientX, touch.clientY);
    if (!marble || marble.vx ** 2 + marble.vy ** 2 > 1) {
      return;
    }
    this.draggedMarble = marble;
    this.isDragging = true;
    this.dragStartX = touch.clientX;
    this.dragStartY = touch.clientY;
    this.dragAimX = touch.clientX;
    this.dragAimY = touch.clientY;
  }

  private onTouchMove(e: TouchEvent): void {
    if (this.isDragging) {
      const touch = e.touches[0];
      this.dragAimX = touch.clientX;
      this.dragAimY = touch.clientY;
    }
  }

  private onTouchEnd(): void {
    this.onMouseUp();
  }

  public update(): void {
    // Update positions
    this.marbles
      .filter((m) => m.isActive)
      .forEach((m) => {
        m.x += m.vx;
        m.y += m.vy;

        // Apply friction
        const friction = 0.98;
        m.vx *= friction;
        m.vy *= friction;

        // Stop very slow marbles
        if (Math.abs(m.vx) < 0.01) {
          m.vx = 0;
        }
        if (Math.abs(m.vy) < 0.01) {
          m.vy = 0;
        }

        // Boundary collision (circular board)
        const dx = m.x - this.centerX,
          dy = m.y - this.centerY,
          dist = totalForce(dx, dy);

        if (dist + m.radius > this.boardRadius) {
          // Marble dropped off table edge
          this.audioManager.playDropSound();
          this.particleSystem.addExplosion(m.x, m.y, m.color, 6);
          m.isActive = false;
        }
      });

    // Marble collisions
    combination(this.marbles.filter((m) => m.isActive)).forEach(([m1, m2]) =>
      this.checkCollision(m1, m2),
    );

    // Update particles
    this.particleSystem.update();

    // Respawn marbles that dropped off
    this.marbles = this.marbles.map((m) =>
      m.isActive ? m : this.respawnMarble(m),
    );

    // Update score
    this.score =
      this.marbles.length - this.marbles.filter((m) => m.isActive).length;

    this.draw();
  }

  private checkCollision(m1: Marble, m2: Marble): void {
    if (!m1.isActive || !m2.isActive) {
      return;
    }

    const dx = m2.x - m1.x,
      dy = m2.y - m1.y,
      dist = totalForce(dx, dy),
      minDist = m1.radius + m2.radius;

    if (dist < minDist) {
      // Collision response
      const angle = Math.atan2(dy, dx),
        sin = Math.sin(angle),
        cos = Math.cos(angle),
        // Relative velocity
        dvx = m2.vx - m1.vx,
        dvy = m2.vy - m1.vy,
        // Relative velocity in collision normal direction
        dvn = dvx * cos + dvy * sin;

      if (dvn >= 0) {
        return;
      } // Moving apart

      // Play collision sound
      this.audioManager.playCollisionSound();

      m1.color = `color-mix(in hsl, ${m1.color}, ${m2.color})` as MixedHsl;

      // Impulse
      const impulse = dvn / 2;
      m1.vx += impulse * cos;
      m1.vy += impulse * sin;
      m2.vx -= impulse * cos;
      m2.vy -= impulse * sin;

      // Separate overlapping marbles
      const overlap = (minDist - dist) / 2 + 0.5;
      m1.x -= overlap * cos;
      m1.y -= overlap * sin;
      m2.x += overlap * cos;
      m2.y += overlap * sin;

      // Marble knocked off board
      const dx2 = m2.x - this.centerX,
        dy2 = m2.y - this.centerY,
        dist2 = totalForce(dx2, dy2);
      if (dist2 > this.boardRadius && !m2.isPlayer) {
        m2.isActive = false;
      }
    }
  }

  private draw(): void {
    // Clear canvas
    this.ctx.fillStyle = "#1a1a1a";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw board
    this.ctx.fillStyle = "#8B7355";
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.boardRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw board border
    this.ctx.strokeStyle = "#654321";
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    // Draw marbles
    this.marbles
      .filter((m) => m.isActive)
      .forEach(({ color, radius, x, y }) => {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Shine effect
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        this.ctx.beginPath();
        this.ctx.arc(x - 4, y - 4, radius * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
      });

    // Draw particles
    this.particleSystem.draw(this.ctx);
    if (this.isDragging && this.draggedMarble) {
      const dx = this.dragAimX - this.dragStartX,
        dy = this.dragAimY - this.dragStartY;

      this.ctx.strokeStyle = "rgba(255, 255, 0, 0.6)";
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([5, 5]);
      this.ctx.beginPath();
      this.ctx.moveTo(this.draggedMarble.x, this.draggedMarble.y);
      this.ctx.lineTo(this.draggedMarble.x - dx, this.draggedMarble.y - dy);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    // Draw UI
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "bold 20px Arial";
    this.ctx.fillText(`Score: ${this.score}`, 20, 40);
    this.ctx.font = "14px Arial";
    this.ctx.fillText("Click & drag to aim, release to flick", 20, 65);
  }
}
