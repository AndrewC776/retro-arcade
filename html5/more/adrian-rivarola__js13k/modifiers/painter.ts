import Modifier from "./modifier";

export function createPainter(pos: Vector, color: string) {
  const paintItemCommand: Command = (player: Player) =>
    player.item?.setColor(color);

  const painter = new Modifier("", "painter", pos, paintItemCommand, color);

  painter.renderDetails = (ctx: Ctx) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, painter.h * 0.2, painter.w, painter.h * 0.25);
    ctx.fillRect(
      painter.w * 0.1,
      painter.h * 0.1,
      painter.w * 0.8,
      painter.h * 0.25
    );
  };

  return painter;
}
