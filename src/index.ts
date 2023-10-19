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
  deviceAppropriatePieceSize,
} from "./utils.js";

import { renderPuzzlePiece } from "./drawPiece.js";
import { drawImage } from "./drawImage.js";
import { easeOutElastic } from "./easing.js";
import TransitionController from "./transitionController.js";
import { renderBlizzard } from "./snow.js";
import LoadingController from "./loadingController.js";
import { drawLoadingBar } from "./loadingBar.js";
import { drawPlayButton, PlayButtonState } from "./drawPlayButton.js";
import { isMouseClickInsidePlayButton } from "./positionUtils.js";
import { showMessageVideo } from "./showVideo.js";

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

let finalImageInitialPosition: Position = { x: 0, y: 0 };
let finalImageFinalPosition: Position = { x: 0, y: 0 };

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

  // Set the place where the image should be at the end
  const height = deviceAppropriatePieceSize() * ROWS;
  if (isTouchDevice) {
    finalImageFinalPosition.x = cnv.width * 0.1;
  } else {
    finalImageFinalPosition.x = cnv.width * 0.25;
  }
  finalImageFinalPosition.y = cnv.height / 2 - height / 2;

  // 100ms grace is enough to make sure we correctly adjust for
  // images already being cached
  setTimeout(LoadingController.startLoading, 100);

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

function end(e: MouseEvent | TouchEvent) {
  // global ui state?
  PlayButtonState.beingPressed = false;

  if (draggedPiece) {
    addNearbyPiece(draggedPiece, PUZZLE_STATE);
    PUZZLE_STATE.forEach((piece) => addNearbyPiece(piece, PUZZLE_STATE));
    if (hasPuzzleFinished(PUZZLE_STATE) && !puzzleComplete) {
      puzzleComplete = true;
      // Set the initial position to the location of the top left piece
      finalImageInitialPosition = { x: topLeftPiece.x, y: topLeftPiece.y };
      TransitionController.startFinalMove();
    }
  }
  draggedPiece = null;

  if (hasPuzzleFinished(PUZZLE_STATE)) {
    // Should check to see if we've clicked a button
    const canvas = getCanvas();
    const clickUpPosition = getCursorPosition(canvas, e);
    if (isMouseClickInsidePlayButton(clickUpPosition, topLeftPiece)) {
      console.log("FINAL CLICK");
      showMessageVideo();
    }
  }
}

function start(e: MouseEvent | TouchEvent) {
  const canvas = getCanvas();
  // no dragging if we're already finished!
  if (hasPuzzleFinished(PUZZLE_STATE)) {
    const canvas = getCanvas();
    const clickUpPosition = getCursorPosition(canvas, e);
    if (isMouseClickInsidePlayButton(clickUpPosition, topLeftPiece)) {
      PlayButtonState.beingPressed = true;
    }
    return;
  }
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

function renderLoop() {
  const canvas = getCanvas();
  const ctx = canvas.getContext("2d");

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Render Snow
  renderBlizzard(ctx);

  const drawn = drawLoadingBar(ctx);

  // If the loading bar was drawn, don't display any puzzle pieces
  if (drawn) {
    return window.requestAnimationFrame(renderLoop);
  }

  if (!puzzleComplete) {
    // render pieces
    PUZZLE_STATE.forEach((puzzlePiece) => renderPuzzlePiece(ctx, puzzlePiece));
  } else {
    topLeftPiece.x =
      finalImageInitialPosition.x +
      (finalImageFinalPosition.x - finalImageInitialPosition.x) *
        easeOutElastic(TransitionController.finalMove);
    topLeftPiece.y =
      finalImageInitialPosition.y +
      (finalImageFinalPosition.y - finalImageInitialPosition.y) *
        easeOutElastic(TransitionController.finalMove);
    drawImage(ctx, { x: topLeftPiece.x, y: topLeftPiece.y });
    drawPlayButton(ctx, topLeftPiece);
  }

  window.requestAnimationFrame(renderLoop);
}
