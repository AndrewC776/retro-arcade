import { expect, test } from './my-test';
import fc from 'fast-check';
import type { CoordModel } from './models/models';
import PlayerController from './reals/PlayerController';
import MoveUp from './commands/MoveUp';
import MoveDown from './commands/MoveDown';
import MoveLeft from './commands/MoveLeft';
import MoveRight from './commands/MoveRight';

test('Can move using wasd model based', async ({ page }) => {
  const asyncAssertions = async (): Promise<void> => {
    const allCommands = fc.commands([
      fc.constant(new MoveUp(page, { x: 300, y: 300 })),
      fc.constant(new MoveDown(page, { x: 300, y: 300 })),
      fc.constant(new MoveLeft(page, { x: 300, y: 300 })),
      fc.constant(new MoveRight(page, { x: 300, y: 300 })),
    ]);

    const property = fc.asyncProperty(allCommands, async (cmds) => {
      const playerController = new PlayerController(page);
      const currentPosition = await playerController.grabPosition();

      const initialStateProvider = (): {
        model: CoordModel;
        real: PlayerController;
      } => ({
        model: currentPosition,
        real: playerController,
      });

      await fc.asyncModelRun(initialStateProvider, cmds);
    });

    const tested = await fc.check(property, {
      numRuns: 10,
      verbose: true,
      maxSkipsPerRun: 1,
      markInterruptAsFailure: false,
    });
    expect(tested.failed).toBe(false);
  };
  await page.goto('localhost:5173?scenario=playerMovement');

  await asyncAssertions();
});
