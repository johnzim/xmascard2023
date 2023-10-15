export const easeInOutSine = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

export const easeIn = (power: number) => (t: number) => t ** power;
export const easeOut = (power: number) => (t: number) =>
  1 - Math.abs((t - 1) ** power);

export const easeInQuad = easeIn(2);

export const easeOutQuad = easeOut(2);

export function easeInOutElastic(t: number, magnitude = 0.65) {
    const p = 1 - magnitude;

    if (t === 0 || t === 1) {
        return t;
    }

    const scaledTime = t * 2;
    const scaledTime1 = scaledTime - 1;

    const s = p / (2 * Math.PI) * Math.asin(1);

    if (scaledTime < 1) {
        return -0.5 * (
            Math.pow( 2, 10 * scaledTime1 ) *
            Math.sin( ( scaledTime1 - s ) * ( 2 * Math.PI ) / p )
        );
    }

    return (Math.pow(2, -10 * scaledTime1) * Math.sin(( scaledTime1 - s) * (2 * Math.PI) / p) * 0.5) + 1;

}

export function easeOutElastic( t: number, magnitude = 0.27 ) {

    if( t === 0 || t === 1 ) {
        return t;
    }

    const p = 1 - magnitude;
    const scaledTime = t * 2;

    const s = p / ( 2 * Math.PI ) * Math.asin( 1 );
    return (
        Math.pow( 2, -10 * scaledTime ) *
        Math.sin( ( scaledTime - s ) * ( 2 * Math.PI ) / p )
    ) + 1;

}
