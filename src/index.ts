import { COLORS, PIECE_SIZE } from "./constants.js";
import { Position, PuzzlePiece } from "./types";
import {
  bringToFront,
  getCursorPosition,
  getPieceForPosition,
} from "./utils.js";

let canvas: HTMLCanvasElement = null;

// Pieces are arranged such that the State is also a Z-buffer
const PUZZLE_STATE: PuzzlePiece[] = [
  { x: 100, y: 100, id: 0 },
  //{ x: 0, y: 0, id: 1 },
  //{ x: 0, y: 0, id: 2 },
  //{ x: 0, y: 0, id: 3 },
  //{ x: 0, y: 0, id: 4 },
  //{ x: 0, y: 0, id: 5 },
  //{ x: 0, y: 0, id: 6 },
];

let clickStartPosition: Position = { x: 0, y: 0 };
let offset: Position = { x: 0, y: 0 };
let draggedPiece: PuzzlePiece = null;

function getCanvas(): HTMLCanvasElement {
  if (canvas) {
    return canvas;
  }
  return document.getElementById("cnv") as HTMLCanvasElement;
}

window.addEventListener("load", () => {
  const cnv = getCanvas();
  fitCanvas(cnv);
  console.debug("Initializing Canvas:", cnv);

  registerMouseEvents(cnv);
  // Start the render loop
  renderLoop(cnv);
});

function fitCanvas(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function registerMouseEvents(canvas: HTMLCanvasElement) {
  // MouseUp needs to be considered no matter where the mouse is relative to
  // the canvas
  window.addEventListener("mouseup", () => {
    draggedPiece = null;
  });

  window.addEventListener("mousedown", (e) => {
    clickStartPosition = getCursorPosition(canvas, e);
    draggedPiece = getPieceForPosition(clickStartPosition, PUZZLE_STATE);
    console.log("draggedPiece", draggedPiece);
    if (!draggedPiece) {
      return;
    }
    offset = {
      x: draggedPiece.x - clickStartPosition.x,
      y: draggedPiece.y - clickStartPosition.y,
    };
    bringToFront(draggedPiece, PUZZLE_STATE);
  });

  window.addEventListener("mousemove", (e) => {
    if (draggedPiece) {
      const newPosition = getCursorPosition(canvas, e);
      draggedPiece.x = newPosition.x + offset.x;
      draggedPiece.y = newPosition.y + offset.y;
    }
  });
}

function renderLoop(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");

  // Track start to target 60fps
  const start = new Date().getTime();

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // render pieces
  PUZZLE_STATE.forEach((puzzlePiece) => renderPuzzlePiece(ctx, puzzlePiece));

  const now = new Date().getTime();

  const delay = 16.6 - (now - start);

  setTimeout(() => renderLoop(canvas), delay);
}

function renderPuzzlePiece(ctx: CanvasRenderingContext2D, piece: PuzzlePiece) {
  //ctx.fillStyle = COLORS[piece.id];
  //ctx.fillRect(piece.x, piece.y, PIECE_SIZE, PIECE_SIZE);
  drawTopEdge(ctx, piece);
  drawBottomEdge(ctx, piece);
  drawRightEdge(ctx, piece)
  drawLeftEdge(ctx, piece)
}


function drawTopEdge(ctx: CanvasRenderingContext2D, piece: PuzzlePiece) {
  ctx.beginPath();

  if (true) {
    drawHorizontalA(ctx, piece);
  }
}


function drawBottomEdge(ctx: CanvasRenderingContext2D, piece: PuzzlePiece) {
  ctx.beginPath();

  if (true) {
    //drawHorizontalA(ctx, {...piece, y: piece.y + PIECE_SIZE});
  }
}

function drawRightEdge(ctx: CanvasRenderingContext2D, piece: PuzzlePiece) {
  ctx.beginPath();

  if (true) {
    drawVerticalA(ctx, {...piece, x: piece.x + PIECE_SIZE});
  }
}


function drawLeftEdge(ctx: CanvasRenderingContext2D, piece: PuzzlePiece) {
  ctx.beginPath();

  if (true) {
    drawVerticalA(ctx, {...piece});
  }
}

function drawVerticalA(ctx: CanvasRenderingContext2D, topPosition: Position) {
  const topP = {...topPosition};
  const mid = { x: topP.x + 0.25 * PIECE_SIZE, y: topP.y + 0.5 * PIECE_SIZE};
  const bottomP = { x: topPosition.x, y: topPosition.y + PIECE_SIZE}
  ctx.beginPath();
  ctx.moveTo(topPosition.x, topPosition.y);
  // Draw Curve
  ctx.bezierCurveTo(
    topP.x - PIECE_SIZE * 0.12,
    topP.y + PIECE_SIZE * 0.75,
    topP.x + PIECE_SIZE * 0.25,
    topP.y + PIECE_SIZE * 0.06,
    mid.x,
    mid.y,
  );
  ctx.moveTo(bottomP.x, bottomP.y);
  ctx.bezierCurveTo(
    bottomP.x - PIECE_SIZE * 0.12,
    bottomP.y - PIECE_SIZE * 0.75,
    bottomP.x + PIECE_SIZE * 0.25,
    bottomP.y + PIECE_SIZE * 0.06,
    mid.x,
    mid.y,
  );
  ctx.stroke();
}

function drawVerticalB(ctx: CanvasRenderingContext2D, position: Position) {
  const topP = {...position};
  const mid = { x: topP.x + 0.25 * PIECE_SIZE, y: topP.y + 0.5 * PIECE_SIZE};
  const bottomP = { x: position.x, y: position.y + PIECE_SIZE}
  ctx.beginPath();
  ctx.moveTo(position.x, position.y);
  // Draw Curve
  ctx.bezierCurveTo(
    topP.x - PIECE_SIZE * 0.12,
    topP.y + PIECE_SIZE * 0.75,
    topP.x + PIECE_SIZE * 0.25,
    topP.y + PIECE_SIZE * 0.06,
    mid.x,
    mid.y,
  );
  ctx.moveTo(bottomP.x, bottomP.y);
  ctx.bezierCurveTo(
    bottomP.x - PIECE_SIZE * 0.12,
    bottomP.y - PIECE_SIZE * 0.75,
    bottomP.x + PIECE_SIZE * 0.25,
    bottomP.y + PIECE_SIZE * 0.06,
    mid.x,
    mid.y,
  );
  ctx.stroke();
}

function drawHorizontalA(ctx: CanvasRenderingContext2D, leftPosition: Position) {
  const leftP = {...leftPosition};
  const mid = {
    y: leftP.y - PIECE_SIZE * 0.25,
    x: leftP.x + PIECE_SIZE * 0.5,
  };
  const rightP = { ...leftPosition, x: leftPosition.x + PIECE_SIZE}
  ctx.beginPath();
  ctx.moveTo(leftPosition.x, leftPosition.y);
  //console.log('leftPosition', leftPosition);
  // Draw Curve
  //ctx.lineTo(mid.x, mid.y);
  //console.log('mid', mid);
  ctx.bezierCurveTo(
    leftP.x + PIECE_SIZE * 0.75 ,
    leftP.y + PIECE_SIZE * 0.12,
    leftP.x + PIECE_SIZE * 0.06,
    leftP.y - PIECE_SIZE * 0.25,
    mid.x,
    mid.y,
  );
  ctx.moveTo(rightP.x, rightP.y);
  ctx.bezierCurveTo(
    rightP.x - PIECE_SIZE * 0.75 ,
    rightP.y + PIECE_SIZE * 0.12,
    rightP.x + PIECE_SIZE * 0.06,
    rightP.y - PIECE_SIZE * 0.25,
    mid.x,
    mid.y,
  );
  ctx.stroke();
}
