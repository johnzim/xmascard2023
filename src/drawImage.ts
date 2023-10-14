import {Position} from 'types.js';
import { COLUMNS, ROWS } from './constants.js';
import { getImage } from './drawPiece.js';
import { deviceAppropriatePieceSize } from './utils.js';

export function drawImage(context: CanvasRenderingContext2D, topLeft: Position) {
  const width = deviceAppropriatePieceSize() * COLUMNS;
  const height = deviceAppropriatePieceSize() * ROWS;
  context.drawImage(getImage(), topLeft.x, topLeft.y, width, height);
}
