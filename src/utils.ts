import { COLUMNS, FIT_DISTANCE, PIECE_SIZE, ROWS } from "./constants.js";
import { Corner, Edge, Position, PuzzlePiece } from "./types.js";

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
    throw new Error(
      "Attempted to bring piece to front which wasn't in the pieces passed to bringToFront!"
    );
  }
  pieces.push(pieces.splice(index, 1)[0]);
}

export function jumblePieces(
  canvas: HTMLCanvasElement,
  puzzlePieces: PuzzlePiece[]
) {
  // scatter x and y randomly
  puzzlePieces.forEach((piece) => {
    piece.x = Math.floor(Math.random() * (canvas.width - PIECE_SIZE));
    piece.y = Math.floor(Math.random() * (canvas.height - PIECE_SIZE));
  });
}

export function getCornerPosition(
  piece: PuzzlePiece,
  corner: Corner
): Position {
  switch (corner) {
    case Corner.BOTTOM_LEFT:
      return { x: piece.x, y: piece.y + PIECE_SIZE };
    case Corner.TOP_LEFT:
      return { x: piece.x, y: piece.y };
    case Corner.TOP_RIGHT:
      return { x: piece.x + PIECE_SIZE, y: piece.y };
    case Corner.BOTTOM_RIGHT:
      return { x: piece.x + PIECE_SIZE, y: piece.y + PIECE_SIZE };
  }
}

function getRandomNonFlatEdge(): Edge {
  const roll = Math.floor(Math.random() * 2);
  if (roll === 0) {
    return Edge.INNY;
  }
  return Edge.OUTY;
}

function oppositeEdge(edge?: Edge): Edge {
  if (!edge) {
    return Edge.FLAT;
  } else if (edge === Edge.INNY) {
    return Edge.OUTY;
  } else if (edge === Edge.OUTY) {
    return Edge.INNY;
  } else if (edge === Edge.FLAT) {
    return getRandomNonFlatEdge();
  }
}

export function setPieceEdges(pieces: PuzzlePiece[]) {
  pieces.forEach((piece) => {
    const above = getPieceAbove(piece, pieces);
    const below = getPieceBelow(piece, pieces);
    const left = getPieceLeft(piece, pieces);
    const right = getPieceRight(piece, pieces);

    piece.top = oppositeEdge(above?.bottom);
    piece.bottom = oppositeEdge(below?.top);
    piece.left = oppositeEdge(left?.right);
    piece.right = oppositeEdge(right?.left);
  });
}

function getPieceAbove(
  piece: PuzzlePiece,
  pieces: PuzzlePiece[]
): PuzzlePiece | null {
  const rowNumber = Math.floor(piece.id / COLUMNS);
  if (rowNumber === 0) {
    // Top row, can't be any piece above
    return null;
  }
  const id = piece.id - COLUMNS;
  return pieces.find((x) => x.id === id);
}

function getPieceBelow(
  piece: PuzzlePiece,
  pieces: PuzzlePiece[]
): PuzzlePiece | null {
  const rowNumber = Math.floor(piece.id / COLUMNS);
  if (rowNumber === ROWS - 1) {
    // Bottom row, can't be any piece below
    return null;
  }
  const id = piece.id + COLUMNS;
  return pieces.find((x) => x.id === id);
}

function getPieceLeft(
  piece: PuzzlePiece,
  pieces: PuzzlePiece[]
): PuzzlePiece | null {
  const columnNumber = piece.id % COLUMNS;
  if (columnNumber === 0) {
    // left most column, can't be any piece to the left
    return null;
  }
  const id = piece.id - 1;
  return pieces.find((x) => x.id === id);
}

function getPieceRight(
  piece: PuzzlePiece,
  pieces: PuzzlePiece[]
): PuzzlePiece | null {
  const columnNumber = piece.id % COLUMNS;
  if (columnNumber === COLUMNS - 1) {
    // right most column, can't be any piece to the right
    return null;
  }
  const id = piece.id + 1;
  return pieces.find((x) => x.id === id);
}

function distanceBetweenPositions(A: Position, B: Position): number {
  return Math.abs(A.x - B.x) + Math.abs(A.y - B.y);
}

export function addNearbyPiece(piece: PuzzlePiece, pieces: PuzzlePiece[]) {
  let connectedPosition: Position | null = null;

  if (piece.top !== Edge.FLAT && !piece.connected.top) {
    const above = getPieceAbove(piece, pieces);
    const fitPosition = { x: above.x, y: above.y + PIECE_SIZE };
    if (above && distanceBetweenPositions(piece, fitPosition) < FIT_DISTANCE) {
      piece.connected.top = above;
      above.connected.bottom = piece;
      connectedPosition = fitPosition;
    }
  }
  if (piece.bottom !== Edge.FLAT && !piece.connected.bottom) {
    const below = getPieceBelow(piece, pieces);
    const fitPosition = { x: below.x, y: below.y - PIECE_SIZE };
    if (below && distanceBetweenPositions(piece, fitPosition) < FIT_DISTANCE) {
      piece.connected.bottom = below;
      below.connected.top = piece;
      connectedPosition = fitPosition;
    }
  }
  if (piece.left !== Edge.FLAT && !piece.connected.left) {
    const left = getPieceLeft(piece, pieces);
    const fitPosition = { x: left.x + PIECE_SIZE, y: left.y };
    if (left && distanceBetweenPositions(piece, fitPosition) < FIT_DISTANCE) {
      piece.connected.left = left;
      left.connected.right = piece;
      connectedPosition = fitPosition;
    }
  }
  if (piece.right !== Edge.FLAT && !piece.connected.right) {
    const right = getPieceRight(piece, pieces);
    const fitPosition = { x: right.x - PIECE_SIZE, y: right.y };
    if (right && distanceBetweenPositions(piece, fitPosition) < FIT_DISTANCE) {
      piece.connected.right = right;
      right.connected.left = piece;
      connectedPosition = fitPosition;
    }
  }
  if (connectedPosition) {
    moveIfNew(piece, connectedPosition);
  }
}

export function moveIfNew(piece: PuzzlePiece, newPosition: Position) {
  if (newPosition.x !== piece.x || newPosition.y !== piece.y) {
    piece.x = newPosition.x;
    piece.y = newPosition.y;
    moveAllConnectedPieces(piece);
  }
}

export function moveAllConnectedPieces(draggedPiece: PuzzlePiece) {
  if (draggedPiece.connected.top) {
    const newPosition: Position = {
      x: draggedPiece.x,
      y: draggedPiece.y - PIECE_SIZE,
    };
    moveIfNew(draggedPiece.connected.top, newPosition);
  }
  if (draggedPiece.connected.bottom) {
    const newPosition: Position = {
      x: draggedPiece.x,
      y: draggedPiece.y + PIECE_SIZE,
    };
    moveIfNew(draggedPiece.connected.bottom, newPosition);
  }
  if (draggedPiece.connected.left) {
    const newPosition: Position = {
      x: draggedPiece.x - PIECE_SIZE,
      y: draggedPiece.y,
    };
    moveIfNew(draggedPiece.connected.left, newPosition);
  }
  if (draggedPiece.connected.right) {
    const newPosition: Position = {
      x: draggedPiece.x + PIECE_SIZE,
      y: draggedPiece.y,
    };
    moveIfNew(draggedPiece.connected.right, newPosition);
  }
}
