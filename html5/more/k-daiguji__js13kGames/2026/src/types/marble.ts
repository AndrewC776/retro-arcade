import type { MixedHsl, PlainHsl } from "@/common/types/color";

export interface Marble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isActive: boolean;
  color: MixedHsl | PlainHsl;
  isPlayer: boolean;
  originalX: number;
  originalY: number;
  originalColor: PlainHsl;
}
