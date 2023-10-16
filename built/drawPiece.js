import { COLUMNS } from "./constants.js";
import { deviceAppropriatePieceSize, getCornerPosition } from "./utils.js";
import { Facing, Edge, Corner } from "./types.js";
import LoadingController from "./loadingController.js";
export function renderPuzzlePiece(ctx, piece) {
    ctx.save();
    ctx.beginPath();
    // Draw the outline of the piece
    drawTopEdge(ctx, piece);
    drawBottomEdge(ctx, piece);
    drawRightEdge(ctx, piece);
    drawLeftEdge(ctx, piece);
    // use the outline as a clipping mask
    ctx.clip("evenodd");
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
        x: Math.round(topP.x + 0.25 * deviceAppropriatePieceSize() * edgeMultiplier),
        y: Math.round(topP.y + 0.5 * deviceAppropriatePieceSize()),
    };
    const bottomP = {
        x: topPosition.x,
        y: topPosition.y + deviceAppropriatePieceSize(),
    };
    ctx.moveTo(topPosition.x, topPosition.y);
    if (edge === Edge.FLAT) {
        ctx.lineTo(bottomP.x, bottomP.y);
        ctx.lineTo(topPosition.x + 0.5 * deviceAppropriatePieceSize() * facingMultiplier, mid.y);
        ctx.lineTo(topPosition.x, topPosition.y);
        return;
    }
    // Draw Curve
    ctx.bezierCurveTo(topP.x - deviceAppropriatePieceSize() * 0.12 * edgeMultiplier, topP.y + deviceAppropriatePieceSize() * 0.75, topP.x + deviceAppropriatePieceSize() * 0.25 * edgeMultiplier, topP.y + deviceAppropriatePieceSize() * 0.06, mid.x, mid.y);
    ctx.lineTo(topPosition.x + 0.5 * deviceAppropriatePieceSize() * facingMultiplier, mid.y);
    //ctx.lineTo(topPosition.x, topPosition.y);
    ctx.moveTo(bottomP.x, bottomP.y);
    ctx.bezierCurveTo(bottomP.x - deviceAppropriatePieceSize() * 0.12 * edgeMultiplier, bottomP.y - deviceAppropriatePieceSize() * 0.75, bottomP.x + deviceAppropriatePieceSize() * 0.25 * edgeMultiplier, bottomP.y + deviceAppropriatePieceSize() * 0.06, mid.x, mid.y);
    ctx.lineTo(topPosition.x + 0.5 * deviceAppropriatePieceSize() * facingMultiplier, mid.y);
    ctx.lineTo(bottomP.x, bottomP.y);
}
function drawHorizontal(ctx, leftPosition, facing, edge) {
    const facingMultiplier = facing === Facing.UP ? 1 : -1;
    const edgeMultiplier = (edge === Edge.OUTY ? 1 : -1) * facingMultiplier;
    const leftP = Object.assign({}, leftPosition);
    const mid = {
        y: Math.round(leftP.y - deviceAppropriatePieceSize() * 0.25 * edgeMultiplier),
        x: Math.round(leftP.x + deviceAppropriatePieceSize() * 0.5),
    };
    const rightP = Object.assign(Object.assign({}, leftPosition), { x: Math.round(leftPosition.x + deviceAppropriatePieceSize()) });
    ctx.moveTo(leftPosition.x, leftPosition.y);
    if (edge === Edge.FLAT) {
        ctx.lineTo(rightP.x, rightP.y);
        ctx.lineTo(leftPosition.x + 0.5 * deviceAppropriatePieceSize(), leftPosition.y + 0.5 * deviceAppropriatePieceSize() * facingMultiplier);
        ctx.lineTo(leftPosition.x, leftPosition.y);
        return;
    }
    // Draw Curve
    ctx.bezierCurveTo(leftP.x + deviceAppropriatePieceSize() * 0.75, leftP.y + deviceAppropriatePieceSize() * 0.12 * edgeMultiplier, leftP.x + deviceAppropriatePieceSize() * 0.06, leftP.y - deviceAppropriatePieceSize() * 0.25 * edgeMultiplier, mid.x, mid.y);
    ctx.lineTo(mid.x, leftP.y + 0.5 * deviceAppropriatePieceSize() * facingMultiplier);
    ctx.lineTo(leftP.x, leftP.y);
    ctx.moveTo(rightP.x, rightP.y);
    ctx.bezierCurveTo(rightP.x - deviceAppropriatePieceSize() * 0.75, rightP.y + deviceAppropriatePieceSize() * 0.12 * edgeMultiplier, rightP.x + deviceAppropriatePieceSize() * 0.06, rightP.y - deviceAppropriatePieceSize() * 0.25 * edgeMultiplier, mid.x, mid.y);
    ctx.lineTo(mid.x, leftP.y + 0.5 * deviceAppropriatePieceSize() * facingMultiplier);
    ctx.lineTo(rightP.x, rightP.y);
}
let img = new Image();
export let imageLoaded = false;
export function getImage() {
    if (!img.src) {
        img.addEventListener("load", () => {
            imageLoaded = true;
            if (LoadingController.count === 0) {
                LoadingController.setSpeed(0.5);
                LoadingController.setSpeed(0.005);
            }
            else {
                LoadingController.setSpeed(0.005);
            }
        });
        img.src = "/img/image2.png";
    }
    return img;
}
let colsNRows = new Set();
function drawPhotoInsidePiece(ctx, piece) {
    const img = getImage();
    const segmentWidth = img.naturalWidth / COLUMNS;
    const fullBleedSegmentWidth = segmentWidth * 2;
    const rowNumber = Math.floor(piece.id / COLUMNS);
    const columnNumber = piece.id % COLUMNS;
    const fullBleedPieceSize = deviceAppropriatePieceSize() * 2;
    colsNRows.add(`${columnNumber}${rowNumber}`);
    // Safari doesn't like sneaky negative value source x and source y values.
    // So we start out taking just the generic position of the piece and if it's a negative value for either x or y we 'pan' back a bit to fill in left/bottom-aligned puzzle edges.
    let sx = segmentWidth * columnNumber;
    let sy = segmentWidth * rowNumber;
    let dx = piece.x;
    let dy = piece.y;
    if (columnNumber > 0) {
        sx -= 0.5 * segmentWidth;
        dx -= 0.5 * deviceAppropriatePieceSize();
    }
    if (rowNumber > 0) {
        sy -= 0.5 * segmentWidth;
        dy -= 0.5 * deviceAppropriatePieceSize();
    }
    ctx.drawImage(img, sx, sy, fullBleedSegmentWidth, fullBleedSegmentWidth, dx, dy, fullBleedPieceSize, fullBleedPieceSize);
}
