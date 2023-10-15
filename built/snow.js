// Should make some snowflakes and deposit them
let frameCount = 8000;
const NUM_SNOWFLAKES = 1300;
const BASE_SNOWFLAKE_SIZE = 2;
const SNOWFLAKE_Y_OFFSET = 200;
const SNOWFLAKE_SEEDS = (() => {
    const offset = [];
    for (let i = 0; i < NUM_SNOWFLAKES; i++) {
        offset.push(Math.random() * 80);
    }
    return offset;
})();
export const renderBlizzard = (ctx) => {
    ctx.save();
    ctx.fillStyle = "white";
    frameCount += 1;
    for (let i = 0; i < NUM_SNOWFLAKES; i++) {
        renderSnowflake(ctx, i, frameCount);
    }
    ctx.restore();
};
const renderSnowflake = (ctx, index, frameCount) => {
    ctx.beginPath();
    // The y position of the snowflake is the product of 3 things
    // index, Snowflake Offset and frame count
    const rnd = SNOWFLAKE_SEEDS[index];
    // The Snowflakes should start with a Y Offset but to compensate for that and to avoid snowflakes 'popping' into screen, we subtract an Offset from the Y. We'll have to add that Offset in later to the canvas wrap around to prevent snowflakes from disappearing too early too
    const initialOffset = -SNOWFLAKE_Y_OFFSET + rnd;
    // Different flakes fall at 20 different speeds with a minimum speed of 1
    const flakeSpeed = rnd + 3;
    const y = initialOffset +
        ((frameCount * (flakeSpeed * 0.018)) % (ctx.canvas.height + SNOWFLAKE_Y_OFFSET));
    const x = (index * 20) % ctx.canvas.width;
    ctx.arc(x, y, BASE_SNOWFLAKE_SIZE + (rnd / 100), 0, 2 * Math.PI);
    ctx.fill();
};
