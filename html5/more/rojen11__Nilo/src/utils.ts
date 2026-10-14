// Linear Interpolation
export function lerp(goal: number, current: number, dt: number): number {
  const difference = goal - current;

  if (difference > dt) return current + dt;
  if (difference < -dt) return current - dt;

  return goal;
}
