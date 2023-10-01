import { COLUMNS, PIECE_SIZE } from "./constants.js";
import { getCornerPosition } from "./utils.js";
import { Facing, Edge, Corner } from "./types.js";
export function renderPuzzlePiece(ctx, piece) {
    ctx.save();
    ctx.beginPath();
    // Draw the outline of the piece
    drawTopEdge(ctx, piece);
    drawBottomEdge(ctx, piece);
    drawRightEdge(ctx, piece);
    drawLeftEdge(ctx, piece);
    // use the outline as a clipping mask
    ctx.clip('evenodd');
    // draw the Photo inside the mask
    drawPhotoInsidePiece(ctx, piece);
    ctx.restore();
}
function drawTopEdge(ctx, piece) {
    const start = getCornerPosition(piece, Corner.TOP_LEFT);
    drawHorizontal(ctx, start, Facing.UP, piece.top);
}
function drawBottomEdge(ctx, piece) {
    const start = getCornerPosition(piece, Corner.BOTTOM_LEFT);
    drawHorizontal(ctx, start, Facing.DOWN, piece.bottom);
}
function drawRightEdge(ctx, piece) {
    const start = getCornerPosition(piece, Corner.TOP_RIGHT);
    drawVertical(ctx, start, Facing.RIGHT, piece.right);
}
function drawLeftEdge(ctx, piece) {
    const start = getCornerPosition(piece, Corner.TOP_LEFT);
    drawVertical(ctx, start, Facing.LEFT, piece.left);
}
function drawVertical(ctx, topPosition, facing, edge) {
    const facingMultiplier = facing === Facing.LEFT ? 1 : -1;
    const edgeMultiplier = (edge === Edge.OUTY ? 1 : -1) * facingMultiplier * -1;
    const topP = Object.assign({}, topPosition);
    const mid = {
        x: topP.x + 0.25 * PIECE_SIZE * edgeMultiplier,
        y: topP.y + 0.5 * PIECE_SIZE,
    };
    const bottomP = { x: topPosition.x, y: topPosition.y + PIECE_SIZE };
    ctx.moveTo(topPosition.x, topPosition.y);
    if (edge === Edge.FLAT) {
        ctx.lineTo(bottomP.x, bottomP.y);
        ctx.lineTo(topPosition.x + 0.5 * PIECE_SIZE * facingMultiplier, mid.y);
        ctx.lineTo(topPosition.x, topPosition.y);
        return;
    }
    // Draw Curve
    ctx.bezierCurveTo(topP.x - PIECE_SIZE * 0.12 * edgeMultiplier, topP.y + PIECE_SIZE * 0.75, topP.x + PIECE_SIZE * 0.25 * edgeMultiplier, topP.y + PIECE_SIZE * 0.06, mid.x, mid.y);
    ctx.lineTo(topPosition.x + 0.5 * PIECE_SIZE * facingMultiplier, mid.y);
    ctx.lineTo(topPosition.x, topPosition.y);
    ctx.moveTo(bottomP.x, bottomP.y);
    ctx.bezierCurveTo(bottomP.x - PIECE_SIZE * 0.12 * edgeMultiplier, bottomP.y - PIECE_SIZE * 0.75, bottomP.x + PIECE_SIZE * 0.25 * edgeMultiplier, bottomP.y + PIECE_SIZE * 0.06, mid.x, mid.y);
    ctx.lineTo(topPosition.x + 0.5 * PIECE_SIZE * facingMultiplier, mid.y);
    ctx.lineTo(topPosition.x, bottomP.y);
}
function drawHorizontal(ctx, leftPosition, facing, edge) {
    const facingMultiplier = facing === Facing.UP ? 1 : -1;
    const edgeMultiplier = (edge === Edge.OUTY ? 1 : -1) * facingMultiplier;
    const leftP = Object.assign({}, leftPosition);
    const mid = {
        y: leftP.y - PIECE_SIZE * 0.25 * edgeMultiplier,
        x: leftP.x + PIECE_SIZE * 0.5,
    };
    const rightP = Object.assign(Object.assign({}, leftPosition), { x: leftPosition.x + PIECE_SIZE });
    ctx.moveTo(leftPosition.x, leftPosition.y);
    if (edge === Edge.FLAT) {
        ctx.lineTo(rightP.x, rightP.y);
        ctx.lineTo(leftPosition.x + 0.5 * PIECE_SIZE, leftPosition.y + 0.5 * PIECE_SIZE * facingMultiplier);
        ctx.lineTo(leftPosition.x, leftPosition.y);
        return;
    }
    //console.log('leftPosition', leftPosition);
    // Draw Curve
    //ctx.lineTo(mid.x, mid.y);
    //console.log('mid', mid);
    ctx.bezierCurveTo(leftP.x + PIECE_SIZE * 0.75, leftP.y + PIECE_SIZE * 0.12 * edgeMultiplier, leftP.x + PIECE_SIZE * 0.06, leftP.y - PIECE_SIZE * 0.25 * edgeMultiplier, mid.x, mid.y);
    ctx.lineTo(mid.x, leftP.y + 0.5 * PIECE_SIZE * facingMultiplier);
    ctx.lineTo(leftP.x, leftP.y);
    ctx.moveTo(rightP.x, rightP.y);
    ctx.bezierCurveTo(rightP.x - PIECE_SIZE * 0.75, rightP.y + PIECE_SIZE * 0.12 * edgeMultiplier, rightP.x + PIECE_SIZE * 0.06, rightP.y - PIECE_SIZE * 0.25 * edgeMultiplier, mid.x, mid.y);
    ctx.lineTo(mid.x, leftP.y + 0.5 * PIECE_SIZE * facingMultiplier);
    ctx.lineTo(rightP.x, rightP.y);
}
let img = new Image();
function getImage() {
    if (!img.src) {
        img.src = "/img/image2.png";
    }
    return img;
}
let colsNRows = new Set();
function drawPhotoInsidePiece(ctx, piece) {
    const img = getImage();
    const segmentWidth = img.width / COLUMNS;
    const fullBleedSegmentWidth = (img.width / COLUMNS) * 2;
    const rowNumber = Math.floor(piece.id / COLUMNS);
    const columnNumber = piece.id % COLUMNS;
    const fullBleedPieceSize = PIECE_SIZE * 2;
    colsNRows.add(`${columnNumber}${rowNumber}`);
    ctx.drawImage(img, segmentWidth * columnNumber - 0.5 * segmentWidth, segmentWidth * rowNumber - 0.5 * segmentWidth, fullBleedSegmentWidth, fullBleedSegmentWidth, piece.x - PIECE_SIZE * 0.5, piece.y - PIECE_SIZE * 0.5, fullBleedPieceSize, fullBleedPieceSize);
}
