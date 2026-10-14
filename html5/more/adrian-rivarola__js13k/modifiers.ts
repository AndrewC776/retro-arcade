export function createTrahsCan(pos: Vector, level: GameObject[]) {
  function command(player: Player) {
    if (!player.item || player.item.type === "player") return;

    let idx = level.findIndex((object) => object.id === player.item.id);
    if (idx !== -1) {
      console.log(`${player.item.id} deleted`);

      player.dropItem();
      level.splice(idx, 1);
    }
  }

  // return new Modifier("TrashCan", "trashcan", pos, command, "purple");
}

// export function createSpeedBooster() {
//   let booster: Modifier;
//   let enabled = true;
//
//   function command(player: Player) {
//     if (!enabled) return;
//
//     enabled = false;
//     booster.color = "rgba(255, 255, 255, 0.0)";
//
//     ++player.maxSpeed;
//
//     setTimeout(() => {
//       enabled = true;
//       booster.color = "rgba(255, 255, 255, 0.1)";
//       --player.maxSpeed;
//     }, Math.floor(2 + Math.random() * 3) * 1000);
//   }
//
//   booster = new Modifier("speedBost", () => {}, "rgba(255, 255, 255, 0.1)");
//
//   booster.update = (level: GameObject[]) => {
//     if (!enabled) return booster;
//
//     let players = level.filter((object) => object.type === "player");
//
//     players.forEach((player) => {
//       let dist = getDistance(player.pos, booster.pos);
//       dist < 30 && command(player as any);
//     });
//
//     return booster;
//   };
//
//   return booster;
// }
//
// export function creatBug() {
//   const command = (object: GameObject) => {
//     if (object.item?.type !== "item" || typeof object.item.color !== "string")
//       return;
//
//     const gradient = ctx.createLinearGradient(0, 0, 32, 32);
//     gradient.addColorStop(0.3, object.item.color);
//     gradient.addColorStop(0.3, "darkgreen");
//
//     object.item.color = gradient;
//   };
//
//   const bug = new Modifier("bug", command, "darkgreen");
//
//   bug.update = (level: GameObject[]) => {
//     const [target, dist] = bug.getClosestObject(
//       level.filter((object) => object.type === "player")
//     );
//     if (dist < 64) command(target);
//
//     bug.pos[0] = (bug.pos[0] + 3) % 512;
//     bug.pos[1] = (bug.pos[1] + 2) % 512;
//
//     return bug;
//   };
//
//   return bug;
// }
