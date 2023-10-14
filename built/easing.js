export const easeInOutSine = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
export const easeIn = (power) => (t) => Math.pow(t, power);
export const easeOut = (power) => (t) => 1 - Math.abs(Math.pow((t - 1), power));
export const easeInQuad = easeIn(2);
export const easeOutQuad = easeOut(2);
