interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export class ParticleSystem {
  private particles: Particle[] = [];

  addExplosion(x: number, y: number, color: string, count: number = 8): void {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2,
        speed = 2 + Math.random() * 2;

      this.particles.push({
        color,
        life: 0.5,
        maxLife: 0.5,
        size: 4 + Math.random() * 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        x,
        y,
      });
    }
  }

  update(dt: number = 0.016): void {
    this.particles = this.particles.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // Gravity
      p.life -= dt;
      return p.life > 0;
    });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach((p) => {
      const alpha = p.life / p.maxLife;
      ctx.fillStyle = p.color
        .replace("rgb", "rgba")
        .replace(")", `, ${alpha})`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  isEmpty(): boolean {
    return this.particles.length === 0;
  }
}
