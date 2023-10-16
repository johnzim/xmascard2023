export const easeInOutSine = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
export const easeIn = (power) => (t) => Math.pow(t, power);
export const easeOut = (power) => (t) => 1 - Math.abs(Math.pow((t - 1), power));
export const easeInQuad = easeIn(2);
export const easeOutQuad = easeOut(2);
export const easeOutQuint = easeOut(5);
export function easeInOutElastic(t, magnitude = 0.65) {
    const p = 1 - magnitude;
    if (t === 0 || t === 1) {
        return t;
    }
    const scaledTime = t * 2;
    const scaledTime1 = scaledTime - 1;
    const s = p / (2 * Math.PI) * Math.asin(1);
    if (scaledTime < 1) {
        return -0.5 * (Math.pow(2, 10 * scaledTime1) *
            Math.sin((scaledTime1 - s) * (2 * Math.PI) / p));
    }
    return (Math.pow(2, -10 * scaledTime1) * Math.sin((scaledTime1 - s) * (2 * Math.PI) / p) * 0.5) + 1;
}
export function easeOutElastic(t, magnitude = 0.27) {
    if (t === 0 || t === 1) {
        return t;
    }
    const p = 1 - magnitude;
    const scaledTime = t * 2;
    const s = p / (2 * Math.PI) * Math.asin(1);
    return (Math.pow(2, -10 * scaledTime) *
        Math.sin((scaledTime - s) * (2 * Math.PI) / p)) + 1;
}
