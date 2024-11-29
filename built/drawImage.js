import { COLUMNS } from "./constants.js";
import { getImage } from "./drawPiece.js";
import { deviceAppropriatePieceSize } from "./utils.js";
export function drawImage(context, topLeft) {
    let width = deviceAppropriatePieceSize() * COLUMNS;
    const img = getImage();
    const ratio = img.height / img.width;
    context.drawImage(getImage(), topLeft.x, topLeft.y, width, width * ratio);
}
