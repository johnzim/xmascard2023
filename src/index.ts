import { COLUMNS, ROWS } from "./constants.js";
import { Edge, Position, PuzzlePiece } from "./types.js";
import {
  bringToFront,
  getCursorPosition,
  getPieceForPosition,
  jumblePieces,
  addNearbyPiece,
  setPieceEdges,
  moveAllConnectedPieces,
  hasPuzzleFinished,
} from "./utils.js";

import { renderPuzzlePiece } from "./drawPiece.js";
import { drawImage } from "./drawImage.js";
import { easeInOutSine } from "./easing.js";

let canvas: HTMLCanvasElement = null;

export let isTouchDevice = false;

// Pieces are arranged such that the State is also a Z-buffer
const PUZZLE_STATE: PuzzlePiece[] = [];

// Initialize the PUZZLE_STATE with the correct number of Columns / Rows
for (let i = 0; i < COLUMNS; i++) {
  for (let j = 0; j < ROWS; j++) {
    PUZZLE_STATE.push({
      x: 100,
      y: 100,
      id: PUZZLE_STATE.length,
      // Init all edges as flat
      top: Edge.FLAT,
      left: Edge.FLAT,
      right: Edge.FLAT,
      bottom: Edge.FLAT,
      connected: {},
    });
  }
}

let topLeftPiece: PuzzlePiece = PUZZLE_STATE[0];

let clickStartPosition: Position = { x: 0, y: 0 };
let offset: Position = { x: 0, y: 0 };
let draggedPiece: PuzzlePiece = null;
let puzzleComplete = false;

function getCanvas(): HTMLCanvasElement {
  if (canvas) {
    return canvas;
  }
  return document.getElementById("cnv") as HTMLCanvasElement;
}

window.addEventListener("load", () => {
  const cnv = getCanvas();
  fitCanvas(cnv);
  registerMouseEvents();

  // Check if this is a touchscreen
  if ("maxTouchPoints" in navigator) {
   isTouchDevice = navigator.maxTouchPoints > 0;
  }

  // Make Puzzle valid
  setPieceEdges(PUZZLE_STATE);

  // Jumble Pieces up
  jumblePieces(cnv, PUZZLE_STATE);

  // Start the render loop
  renderLoop();
});

function fitCanvas(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function moveFinalMove() {
    finalMove += 0.0018;
    if (finalMove < 1) {
      setTimeout(moveFinalMove, 1);
    }
}

function end() {
  if (draggedPiece) {
    addNearbyPiece(draggedPiece, PUZZLE_STATE);
    PUZZLE_STATE.forEach((piece) => addNearbyPiece(piece, PUZZLE_STATE));
    if (hasPuzzleFinished(PUZZLE_STATE) && !puzzleComplete) {
      puzzleComplete = true;
      // Set the initial position to the location of the top left piece
      initialPosition = {x: topLeftPiece.x, y: topLeftPiece.y};
      moveFinalMove();
    }
  }
  draggedPiece = null;
}

function start(e: MouseEvent | TouchEvent) {
  const canvas = getCanvas();
  clickStartPosition = getCursorPosition(canvas, e);
  draggedPiece = getPieceForPosition(clickStartPosition, PUZZLE_STATE);
  if (!draggedPiece) {
    return;
  }
  offset = {
    x: draggedPiece.x - clickStartPosition.x,
    y: draggedPiece.y - clickStartPosition.y,
  };
  bringToFront(draggedPiece, PUZZLE_STATE);
}

function move(e: MouseEvent) {
  const canvas = getCanvas();
  if (draggedPiece) {
    const newPosition = getCursorPosition(canvas, e);
    draggedPiece.x = newPosition.x + offset.x;
    draggedPiece.y = newPosition.y + offset.y;
    moveAllConnectedPieces(draggedPiece);
  }
}

function registerMouseEvents() {
  // MouseUp needs to be considered no matter where the mouse is relative to
  // the canvas
  window.addEventListener("mouseup", end);
  window.addEventListener("touchend", end);

  window.addEventListener("mousedown", start);
  window.addEventListener("touchstart", start);

  window.addEventListener("mousemove", move);
  window.addEventListener("touchmove", move);
}

// Once the puzzle is finished the puzzle needs to move to the centre of the
let finalMove = 0;
let initialPosition: Position = {x:0, y:0} ;
let finalPosition: Position = {x: 0, y:0};

function renderLoop() {
  const canvas = getCanvas();
  const ctx = canvas.getContext("2d");

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!puzzleComplete) {
    // render pieces
    PUZZLE_STATE.forEach((puzzlePiece) => renderPuzzlePiece(ctx, puzzlePiece));
  } else {
    drawImage(ctx, {x: topLeftPiece.x, y: topLeftPiece.y});
    topLeftPiece.x = initialPosition.x + ((finalPosition.x - initialPosition.x) * easeInOutSine(finalMove));
    topLeftPiece.y = initialPosition.y + ((finalPosition.y - initialPosition.y) * easeInOutSine(finalMove));
  }

  window.requestAnimationFrame(renderLoop);
}
