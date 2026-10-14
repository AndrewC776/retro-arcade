import mapa from "../assets/mapa1-min.png";
import man from "../assets/man.png";
import items from "../assets/items.png";

const canvas: HTMLCanvasElement = document.createElement("canvas");
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

canvas.id = "game";
canvas.width = 512;
canvas.height = 512;

const TILE_SIZE = 512 / 8;
const HALF_TILE = TILE_SIZE / 2;

document.body.appendChild(canvas);

const KEYBOARD: Record<string, boolean> = {};

const table: ItemModifier = {
  x: 3,
  y: 0,
  items: [],
  imageIdx: 4,
  color: "yellow",
  elemName: "Table",
  onAction(player: Player) {
    if (player.items.length) {
      this.items = this.items.concat(player.items);
      player.items = [];
    } else {
      player.items = this.items;
      this.items = [];
    }
  },
};
const goal: ItemModifier = {
  x: 5,
  y: 0,
  color: "",
  imageIdx: 4,
  currentGoal: createRandomGoal(),
  elemName: "Objetivo:",
  onAction(player: Player) {
    if (player.items.length !== this.currentGoal.length) return;

    const valid = player.items.every(
      (item, idx) =>
        item.elemName === this.currentGoal[idx].elemName &&
        item.color === this.currentGoal[idx].color
    );
    if (valid) {
      ++player.score;
      player.items = [];
      this.currentGoal = createRandomGoal();
    }
  },
};
const trashCan: ItemModifier = {
  x: 0,
  y: 7,
  color: "",
  imageIdx: 4,
  elemName: "Trash",
  onAction(player: Player) {
    player.items = [];
  },
};

const itemElements: ItemModifier[] = [
  createPainter(7, 3, "red", 1),
  createPainter(7, 4, "blue", 0),
  createPainter(7, 5, "purple", 2),
  createProvider(0, 1, "<Header/>"),
  createProvider(0, 3, "<Article/>"),
  createProvider(0, 5, "<Footer/>"),
  goal,
  table,
  trashCan,
];

function createProvider(x: number, y: number, elemName: string): ItemModifier {
  return {
    x,
    y,
    elemName,
    color: "white",
    imageIdx: 3,
    onAction(player: Player) {
      player.items.length < 3 &&
        player.items.push({
          color: this.color,
          elemName: this.elemName,
        });
    },
  };
}

function createPainter(
  x: number,
  y: number,
  color: string,
  imageIdx: number
): ItemModifier {
  return {
    x,
    y,
    color,
    imageIdx,
    elemName: color,
    onAction(player: Player) {
      if (!player.items.length) return;
      player.items.forEach((item) => (item.color = this.color));
    },
  };
}

function drawItems(items: Item[]) {
  ctx.font = "bold 14px monospace";
  items.forEach((item, idx) => {
    ctx.fillStyle = item.color;
    ctx.fillText(item.elemName, HALF_TILE, TILE_SIZE + 16 * (idx + 1));
  });
}

function drawElement(el: ItemModifier) {
  ctx.save();
  ctx.translate(el.x * TILE_SIZE, el.y * TILE_SIZE);
  ctx.drawImage(
    assets.items,
    el.imageIdx * 16,
    0,
    16,
    16,
    0,
    0,
    TILE_SIZE,
    TILE_SIZE
  );

  if (el.elemName) {
    ctx.font = " 12px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(el.elemName, HALF_TILE, TILE_SIZE);

    if (el.elemName === "Table" || el.currentGoal) {
      const items = el.currentGoal || el.items;
      drawItems(items);
    }
  }

  ctx.restore();
}

interface CloseTarget {
  dist: number;
  target: ItemModifier;
}
function getClosestTarget(p: Player): CloseTarget {
  const { x, y } = getGridPos(p);
  let closest: CloseTarget = {
    dist: 1000,
    target: null,
  };
  itemElements.forEach((target, idx) => {
    let dist = Math.sqrt(Math.pow(target.x - x, 2) + Math.pow(target.y - y, 2));
    if (dist < closest.dist) {
      closest = { dist, target };
    }
  });
  return closest;
}

function createRandomGoal(): Item[] {
  const validElements = ["<Header/>", "<Article/>", "<Footer/>"],
    validColors = ["red", "blue", "purple"];

  const rand = [
    Math.floor(Math.random() * validColors.length),
    Math.floor(Math.random() * validColors.length),
    Math.floor(Math.random() * validColors.length),
  ];

  return validElements.map((elemName, idx) => ({
    elemName,
    color: validColors[rand[idx]],
  }));
}

type Player = typeof p1;
interface ItemModifier {
  x: number;
  y: number;
  color: string;
  imageIdx: number;
  elemName?: string;
  currentGoal?: Item[];
  items?: Item[];
  onAction(player: Player): void;
}
interface Item {
  color: string;
  elemName: string;
}

const assets = {
  background: new Image(),
  man: new Image(),
  items: new Image(),
};
assets.background.src = mapa;
assets.man.src = man;
assets.items.src = items;

const p1 = {
  name: "p1",
  x: TILE_SIZE * 3.5,
  y: TILE_SIZE * 3.5,
  w: HALF_TILE,
  h: HALF_TILE * 1.5,
  dx: 0,
  dy: 0,
  color: "lightblue",
  speed: 3,
  score: 0,
  imgIdx: 0,
  direction: -1,
  items: [],
  commitAction: false,
  actionCoolDown: 0,
  move() {
    if (KEYBOARD[37]) {
      this.dx = -this.speed;
      this.direction = -1;
    } else if (KEYBOARD[39]) {
      this.dx = this.speed;
      this.direction = 1;
    } else {
      this.dx = 0;
    }

    if (KEYBOARD[38]) {
      this.dy = -this.speed;
    } else if (KEYBOARD[40]) {
      this.dy = this.speed;
    } else {
      this.dy = 0;
    }
  },
  update() {
    this.move();
    this.x += this.dx;
    this.y += this.dy;

    this.actionCoolDown > 0 && --this.actionCoolDown;
    if (!this.actionCoolDown && (this.commitAction || KEYBOARD[32])) {
      const { dist, target } = getClosestTarget(this);
      if (dist <= 1) {
        this.actionCoolDown = 100;
        target.onAction(this);
      }
    }

    this.x = Math.max(0, Math.min(this.x, canvas.width - this.w));
    this.y = Math.max(0, Math.min(this.y, canvas.height - this.h));

    this.imgIdx += 0.05;
  },
  render() {
    this.update();

    ctx.save();
    ctx.translate(this.x, this.y);

    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, this.w, this.h);

    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = "12px monospace";
    ctx.fillText(this.name, this.w / 2, this.h + 12);

    // center
    ctx.beginPath();
    ctx.arc(this.w / 2, this.h / 2, 2, 0, Math.PI * 2);
    ctx.fill();

    if (this.items.length) {
      ctx.translate(-this.w / 2, -this.h - (this.items.length + 1) * 20);
      drawItems(this.items);
    }
    ctx.restore();
  },
};

let assetsLoaded = 0;
const totalAssets = Object.keys(assets).length;

for (let key in assets) {
  assets[key].onload = () => ++assetsLoaded === totalAssets && start();
}

interface Pos {
  x: number;
  y: number;
}

function getDistatnce(o1: Pos, o2: Pos) {
  return Math.sqrt(Math.pow(o1.x - o2.x, 2) + Math.pow(o1.y - o2.y, 2));
}

function getGridPos({ x, y, w, h }: Player): Pos {
  let xPos = Math.floor((x + w / 2) / TILE_SIZE);
  let yPos = Math.floor((y + h / 2) / TILE_SIZE);

  return { x: xPos, y: yPos };
}

function start() {
  requestAnimationFrame(start);

  ctx.drawImage(assets.background, 0, 0);
  p1.render();
  itemElements.forEach(drawElement);

  ctx.save();
  ctx.font = "24px monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";

  const { x, y } = getGridPos(p1);
  ctx.fillText(`.`, x, y);

  ctx.translate(canvas.width / 2, TILE_SIZE * 8);
  ctx.fillText("Score: " + p1.score, 0, 0);

  ctx.restore();
}

onkeyup = onkeydown = (ev) => {
  KEYBOARD[ev.keyCode] = ev.type[3] === "d";
};

onclick = () => (p1.commitAction = true);

onresize = () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
};

// start();

// const bg = await createImageBitmap(
//   assets.background,
//   0,
//   0,
//   TILE_SIZE,
//   TILE_SIZE
// );
// const pattern = ctx.createPattern(bg, "repeat");
// ctx.save();
// ctx.fillStyle = pattern;
// ctx.fillRect(0, 0, canvas.width, canvas.height);
//
// ctx.restore();
