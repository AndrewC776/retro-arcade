import GameObject from "../gameObject";
import Modifier from "./modifier";

import GAME from "../game";

export function createItemProvider(pos: Vector, itemId: string) {
  const createItemCommand = (player: Player) => {
    if (player.item) return;

    const newItem = new GameObject(itemId, "item", player.pos, "white");
    player.pickItem(newItem);

    GAME.objects.push(newItem);
  };

  const provider = new Modifier(itemId, "provider", pos, createItemCommand);

  return provider;
}
