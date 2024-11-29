import { Position } from "types.js";
import { COLUMNS, ROWS } from "./constants.js";
import { getImage } from "./drawPiece.js";
import { deviceAppropriatePieceSize } from "./utils.js";

export function drawImage(
  context: CanvasRenderingContext2D,
  topLeft: Position
) {
  let width = deviceAppropriatePieceSize() * COLUMNS;
  const img = getImage();

  const ratio = img.height / img.width;

  context.drawImage(getImage(), topLeft.x, topLeft.y, width, width * ratio);
}
