import { npcBehavior } from './npc-behavior';
import { npcSeekAndDestroy } from './npc-seek-and-destroy';
import { npcSeekAndDestroyAttackInBetween } from './npc-seek-and-destroy-and-attack-in-between';
import { playerMovement } from './player-movement';
import { npcAcquireTarget } from './npc-acquire-target';
import { weapons } from './weapons';
import { playerAttacks } from './player-attacks';
import { buildingHq } from './building-hq';

export const playwrightScenes: Record<string, () => void> = {
  npcBehavior,
  playerMovement,
  npcAcquireTarget,
  weapons,
  playerAttacks,
  buildingHq,
  npcSeekAndDestroy,
  npcSeekAndDestroyAttackInBetween,
};
