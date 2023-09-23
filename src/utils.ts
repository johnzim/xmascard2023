import { PIECE_SIZE } from "./constants.js";
import { Position, PuzzlePiece } from "./types";

export function getCursorPosition(
  canvas: HTMLCanvasElement,
  event: MouseEvent
): Position {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x, y };
}

export function getPieceForPosition(
  position: Position,
  pieces: PuzzlePiece[]
): PuzzlePiece | null {
  console.log('position', position);
  console.log('pieces', pieces);
  // working from front to back check which piece is valid
  for (let i = pieces.length - 1; i > -1; i--) {
    let piece = pieces[i];
    if (position.x < piece.x + PIECE_SIZE && position.x >= piece.x) {
      if (position.y < piece.y + PIECE_SIZE && position.y >= piece.y) {
        return piece;
      }
    }
  }
}

export function bringToFront(piece: PuzzlePiece, pieces: PuzzlePiece[]) {
  const index = pieces.indexOf(piece);
  if (index === -1) {
    throw new Error("Attempted to bring piece to front which wasn't in the pieces passed to bringToFront!");
  }
  pieces.push(pieces.splice(index, 1)[0]);
}

export function jumblePieces(pieces: PuzzlePiece[]) {
  // find mid point of canvas
  // find max jumble distance
  // scatter x and y randomly
}

export enum Corner {
  topLeft = "TOP_LEFT",
  topRight = "TOP_RIGHT",
  bottomLeft = "BOTTOM_LEFT",
  bottomRight = "BOTTOM_RIGHT",
}

export function getCornerPosition(piece: PuzzlePiece, corner: Corner ): Position {
  switch (corner) {
    case Corner.bottomLeft:
      return {x: piece.x, y: piece.y + PIECE_SIZE};
    case Corner.topLeft:
      return {x: piece.x, y: piece.y};
    case Corner.topRight:
      return {x: piece.x + PIECE_SIZE, y: piece.y};
    case Corner.bottomRight:
      return {x: piece.x + PIECE_SIZE, y: piece.y + PIECE_SIZE};
  }
}


