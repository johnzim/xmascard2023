import { COLUMNS, ROWS } from "./constants.js";
import { Position, PuzzlePiece } from "./types.js";
import {
  bringToFront,
  getCursorPosition,
  getPieceForPosition,
  jumblePieces,
} from "./utils.js";

import { renderPuzzlePiece } from "./drawPiece.js";

let canvas: HTMLCanvasElement = null;

// Pieces are arranged such that the State is also a Z-buffer
const PUZZLE_STATE: PuzzlePiece[] = [];

// Initialize the PUZZLE_STATE with the correct number of Columns / Rows
for (let i = 0; i < COLUMNS; i++) {
  for (let j = 0; j < ROWS; j++) {
    PUZZLE_STATE.push({ x: 100, y: 100, id: PUZZLE_STATE.length });
  }
}

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

  // Jumble Pieces up
  jumblePieces(cnv, PUZZLE_STATE);

  // Start the render loop
  renderLoop();
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

      const columnNumber = (draggedPiece.id % COLUMNS) + 1;
      const rowNumber = (draggedPiece.id % ROWS) + 1;
      console.log("columnNumber", columnNumber, rowNumber);
    }
  });
}

function renderLoop() {
  const canvas = getCanvas();
  const ctx = canvas.getContext("2d");

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  // render pieces
  PUZZLE_STATE.forEach((puzzlePiece) => renderPuzzlePiece(ctx, puzzlePiece));

  window.requestAnimationFrame(renderLoop);
}
