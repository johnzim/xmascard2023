import { PIECE_SIZE } from "./constants.js";
import { Corner, Position, PuzzlePiece } from "./types.js";

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

export function jumblePieces(canvas: HTMLCanvasElement, puzzlePieces: PuzzlePiece[]) {
  // scatter x and y randomly
  puzzlePieces.forEach((piece) => {
    piece.x = Math.floor(Math.random() * (canvas.width - PIECE_SIZE));
    piece.y = Math.floor(Math.random() * (canvas.height - PIECE_SIZE));
  });
}

export function getCornerPosition(piece: PuzzlePiece, corner: Corner ): Position {
  switch (corner) {
    case Corner.BOTTOM_LEFT:
      return {x: piece.x, y: piece.y + PIECE_SIZE};
    case Corner.TOP_LEFT:
      return {x: piece.x, y: piece.y};
    case Corner.TOP_RIGHT:
      return {x: piece.x + PIECE_SIZE, y: piece.y};
    case Corner.BOTTOM_RIGHT:
      return {x: piece.x + PIECE_SIZE, y: piece.y + PIECE_SIZE};
  }
}


