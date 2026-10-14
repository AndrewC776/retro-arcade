import type fc from 'fast-check';
import type { CoordModel } from '../models/models';
import type PlayerController from '../reals/PlayerController';
import { expect, type Page } from '@playwright/test';

export default class MoveRight
  implements fc.AsyncCommand<CoordModel, PlayerController, true>
{
  coords: CoordModel;
  count = 0;
  page: Page;

  constructor(page: Page, coords: CoordModel) {
    this.coords = coords;
    this.page = page;
  }

  async check(): Promise<boolean> {
    return this.coords.x < 600;
  }

  async run(model: CoordModel, real: PlayerController): Promise<void> {
    this.count += 1;
    const startingCoord = await real.grabPosition();
    await real.moveRight();
    const newCoords = await real.grabPosition();
    expect(newCoords.x).toBeGreaterThan(startingCoord.x);
    this.coords = newCoords;
  }

  toString(): string {
    return `Moving up coords: ${JSON.stringify(this.coords)}`;
  }
}
