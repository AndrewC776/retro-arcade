import { TILE_SIZE } from "./setup";

export function clamp(min: number, max: number, num: number) {
  return Math.max(min, Math.min(num, max));
}

export function addVectors([x1, y1]: Vector, [x2, y2]: Vector): Vector {
  return [x1 + x2, y1 + y2];
}

export function getDistance([x1, y1]: Vector, [x2, y2]: Vector): number {
  return Math.hypot(x2 - x1, y2 - y1);
}

export const HUE_MAP: Record<string, number> = {
  blue: 226,
  green: 150,
  orange: 55,
  purple: 284,
  red: 1,
};

export function createRandomObjective(items: string[], colors: string[]): Task {
  let randItems: number[] = [],
    randColors: number[] = [],
    idxItem: number,
    idxColor: number,
    size = items.length - Math.floor(Math.random() * items.length * 0.5);

  const components: PageComponent[] = [];

  for (let i = 0; i < size; i++) {
    do {
      idxItem = Math.floor(Math.random() * items.length);
      idxColor = Math.floor(Math.random() * colors.length);
    } while (randItems.includes(idxItem) || randColors.includes(idxColor));

    randItems.push(idxItem);
    randColors.push(idxColor);

    components.push({
      itemId: items[idxItem],
      color: colors[idxColor],
    });
  }

  return {
    components,
    completed: false,
  };
}
