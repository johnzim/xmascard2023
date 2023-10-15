import { COLUMNS, ROWS } from "./constants.js";
import { getImage } from "./drawPiece.js";
import { deviceAppropriatePieceSize } from "./utils.js";
export function drawImage(context, topLeft) {
    let width = deviceAppropriatePieceSize() * COLUMNS;
    let height = deviceAppropriatePieceSize() * ROWS;
    context.drawImage(getImage(), topLeft.x, topLeft.y, width, height);
}
