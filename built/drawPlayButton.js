import { COLUMNS, ROWS } from "./constants.js";
import { deviceAppropriatePieceSize } from "./utils.js";
export function getPlayButtonSize() {
    let imageWidth = deviceAppropriatePieceSize() * COLUMNS;
    return imageWidth / 5;
}
export const PlayButtonState = {
    beingPressed: false,
};
export function getPlayButtonPosition(topLeft) {
    const imageWidth = deviceAppropriatePieceSize() * COLUMNS;
    const imageHeight = deviceAppropriatePieceSize() * ROWS;
    const buttonSize = getPlayButtonSize();
    const leftEdge = topLeft.x + 0.5 * imageWidth - 0.5 * buttonSize;
    const topEdge = topLeft.y + 0.5 * imageHeight - 0.5 * buttonSize;
    return { x: leftEdge, y: topEdge };
}
export function drawPlayButton(ctx, topLeftPiece) {
    const buttonSize = getPlayButtonSize();
    const playButtonPosition = getPlayButtonPosition(topLeftPiece);
    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = "black";
    ctx.fillStyle = PlayButtonState.beingPressed ? "white" : "#dddddd";
    ctx.beginPath();
    ctx.moveTo(playButtonPosition.x, playButtonPosition.y);
    ctx.lineTo(playButtonPosition.x + buttonSize, playButtonPosition.y + 0.5 * buttonSize);
    ctx.lineTo(playButtonPosition.x, playButtonPosition.y + buttonSize);
    ctx.lineTo(playButtonPosition.x, playButtonPosition.y);
    ctx.fill();
    ctx.restore();
}
