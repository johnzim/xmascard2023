import { COLUMNS, ROWS } from "./constants.js";
import { getImage } from "./drawPiece.js";
import { deviceAppropriatePieceSize } from "./utils.js";
export function drawImage(context, topLeft) {
    let width = deviceAppropriatePieceSize() * COLUMNS;
    let height = deviceAppropriatePieceSize() * ROWS;
    const finalWidth = window.innerWidth;
    const widthDelta = finalWidth - width;
    const ratio = height / width;
    // width and height should start at the appropriate size and then rescale to the full screen
    //width += widthDelta * TransitionController.finalMove;
    //context.drawImage(getImage(), topLeft.x, topLeft.y, width, width * ratio);
    context.drawImage(getImage(), topLeft.x, topLeft.y, width, width * ratio);
}
