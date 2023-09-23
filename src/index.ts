import { COLORS, PIECE_SIZE } from "./constants.js";
import { Facing, Position, PuzzlePiece, Edge } from "./types.js";
import {
  bringToFront,
  Corner,
  getCornerPosition,
  getCursorPosition,
  getPieceForPosition,
} from "./utils.js";

let canvas: HTMLCanvasElement = null;

// Pieces are arranged such that the State is also a Z-buffer
const PUZZLE_STATE: PuzzlePiece[] = [
  { x: 100, y: 100, id: 0 },
  { x: 0, y: 0, id: 1 },
  { x: 0, y: 0, id: 2 },
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
  ctx.fillStyle = COLORS[piece.id];
  ctx.beginPath();
  drawTopEdge(ctx, piece);
  drawBottomEdge(ctx, piece);
  drawRightEdge(ctx, piece);
  drawLeftEdge(ctx, piece);
  ctx.fill("evenodd");
}

function drawTopEdge(ctx: CanvasRenderingContext2D, piece: PuzzlePiece) {
  const start = getCornerPosition(piece, Corner.topLeft);

  if (true) {
    drawHorizontal(ctx, start, Facing.UP, Edge.INNY);
  }
}

function drawBottomEdge(ctx: CanvasRenderingContext2D, piece: PuzzlePiece) {
  const start = getCornerPosition(piece, Corner.bottomLeft);
  if (true) {
    drawHorizontal(ctx, start, Facing.DOWN, Edge.INNY);
  }
}

function drawRightEdge(ctx: CanvasRenderingContext2D, piece: PuzzlePiece) {
  const start = getCornerPosition(piece, Corner.topRight);
  if (true) {
    drawVertical(ctx, start, Facing.RIGHT, Edge.INNY);
  }
}

function drawLeftEdge(ctx: CanvasRenderingContext2D, piece: PuzzlePiece) {
  const start = getCornerPosition(piece, Corner.topLeft);
  if (true) {
    drawVertical(ctx, start, Facing.LEFT, Edge.OUTY);
  }
}

function drawVertical(
  ctx: CanvasRenderingContext2D,
  topPosition: Position,
  facing: Facing,
  edge: Edge
) {
  const facingMultiplier = facing === Facing.LEFT ? 1 : -1;
  const edgeMultiplier = (edge === Edge.OUTY ? 1 : -1) * facingMultiplier * -1;
  const topP = { ...topPosition };
  const mid = {
    x: topP.x + 0.25 * PIECE_SIZE * edgeMultiplier,
    y: topP.y + 0.5 * PIECE_SIZE,
  };
  const bottomP = { x: topPosition.x, y: topPosition.y + PIECE_SIZE };
  ctx.moveTo(topPosition.x, topPosition.y);
  if (edge === Edge.FLAT) {
    ctx.lineTo(bottomP.x, bottomP.y);
    ctx.lineTo(topPosition.x + 0.5 * PIECE_SIZE * facingMultiplier, mid.y);
    ctx.lineTo(topPosition.x, topPosition.y);
    return;
  }
  // Draw Curve
  ctx.bezierCurveTo(
    topP.x - PIECE_SIZE * 0.12 * edgeMultiplier,
    topP.y + PIECE_SIZE * 0.75,
    topP.x + PIECE_SIZE * 0.25 * edgeMultiplier,
    topP.y + PIECE_SIZE * 0.06,
    mid.x,
    mid.y
  );
  ctx.lineTo(topPosition.x + 0.5 * PIECE_SIZE * facingMultiplier, mid.y);
  ctx.lineTo(topPosition.x, topPosition.y);
  ctx.moveTo(bottomP.x, bottomP.y);
  ctx.bezierCurveTo(
    bottomP.x - PIECE_SIZE * 0.12 * edgeMultiplier,
    bottomP.y - PIECE_SIZE * 0.75,
    bottomP.x + PIECE_SIZE * 0.25 * edgeMultiplier,
    bottomP.y + PIECE_SIZE * 0.06,
    mid.x,
    mid.y
  );
  ctx.lineTo(topPosition.x + 0.5 * PIECE_SIZE * facingMultiplier, mid.y);
  ctx.lineTo(topPosition.x, bottomP.y);
}

function drawHorizontal(
  ctx: CanvasRenderingContext2D,
  leftPosition: Position,
  facing: Facing,
  edge: Edge
) {
  const facingMultiplier = facing === Facing.UP ? 1 : -1;
  const edgeMultiplier = (edge === Edge.OUTY ? 1 : -1) * facingMultiplier;
  const leftP = { ...leftPosition };
  const mid = {
    y: leftP.y - PIECE_SIZE * 0.25 * edgeMultiplier,
    x: leftP.x + PIECE_SIZE * 0.5,
  };
  const rightP = { ...leftPosition, x: leftPosition.x + PIECE_SIZE };
  ctx.moveTo(leftPosition.x, leftPosition.y);
  if (edge === Edge.FLAT) {
    ctx.lineTo(rightP.x, rightP.y);
    ctx.lineTo(leftPosition.x + 0.5 * PIECE_SIZE, leftPosition.y + 0.5 * PIECE_SIZE * facingMultiplier);
    ctx.lineTo(leftPosition.x, leftPosition.y);
    return
  }
  //console.log('leftPosition', leftPosition);
  // Draw Curve
  //ctx.lineTo(mid.x, mid.y);
  //console.log('mid', mid);
  ctx.bezierCurveTo(
    leftP.x + PIECE_SIZE * 0.75,
    leftP.y + PIECE_SIZE * 0.12 * edgeMultiplier,
    leftP.x + PIECE_SIZE * 0.06,
    leftP.y - PIECE_SIZE * 0.25 * edgeMultiplier,
    mid.x,
    mid.y
  );
  ctx.lineTo(mid.x, leftP.y + 0.5 * PIECE_SIZE * facingMultiplier);
  ctx.lineTo(leftP.x, leftP.y);
  ctx.moveTo(rightP.x, rightP.y);
  ctx.bezierCurveTo(
    rightP.x - PIECE_SIZE * 0.75,
    rightP.y + PIECE_SIZE * 0.12 * edgeMultiplier,
    rightP.x + PIECE_SIZE * 0.06,
    rightP.y - PIECE_SIZE * 0.25 * edgeMultiplier,
    mid.x,
    mid.y
  );
  ctx.lineTo(mid.x, leftP.y + 0.5 * PIECE_SIZE * facingMultiplier);
  ctx.lineTo(rightP.x, rightP.y);
}
