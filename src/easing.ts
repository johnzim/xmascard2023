export const easeInOutSine = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

export const easeIn = (power: number) => (t: number) => t ** power;
export const easeOut = (power: number) => (t: number) =>
  1 - Math.abs((t - 1) ** power);

export const easeInQuad = easeIn(2);

export const easeOutQuad = easeOut(2);
