import { COLUMNS, ROWS } from "./constants.js";
import { Edge } from "./types.js";
import { bringToFront, getCursorPosition, getPieceForPosition, jumblePieces, addNearbyPiece, setPieceEdges, moveAllConnectedPieces, hasPuzzleFinished, deviceAppropriatePieceSize, } from "./utils.js";
import { renderPuzzlePiece } from "./drawPiece.js";
import { drawImage } from "./drawImage.js";
import { easeOutElastic } from "./easing.js";
import TransitionController from "./transitionController.js";
import { renderBlizzard } from "./snow.js";
import LoadingController from "./loadingController.js";
import { drawLoadingBar } from "./loadingBar.js";
let canvas = null;
export let isTouchDevice = false;
// Pieces are arranged such that the State is also a Z-buffer
const PUZZLE_STATE = [];
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
let topLeftPiece = PUZZLE_STATE[0];
let clickStartPosition = { x: 0, y: 0 };
let offset = { x: 0, y: 0 };
let draggedPiece = null;
let puzzleComplete = false;
let finalImageInitialPosition = { x: 0, y: 0 };
let finalImageFinalPosition = { x: 0, y: 0 };
function getCanvas() {
    if (canvas) {
        return canvas;
    }
    return document.getElementById("cnv");
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
    }
    else {
        finalImageFinalPosition.x = cnv.width * 0.25;
    }
    finalImageFinalPosition.y = cnv.height / 2 - height / 2;
    setTimeout(LoadingController.startLoading, 1000);
    // Make Puzzle valid
    setPieceEdges(PUZZLE_STATE);
    // Jumble Pieces up
    jumblePieces(cnv, PUZZLE_STATE);
    // Start the render loop
    renderLoop();
});
function fitCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
function end() {
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
}
function start(e) {
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
function move(e) {
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
    drawLoadingBar(ctx);
    if (!puzzleComplete) {
        // render pieces
        PUZZLE_STATE.forEach((puzzlePiece) => renderPuzzlePiece(ctx, puzzlePiece));
    }
    else {
        drawImage(ctx, { x: topLeftPiece.x, y: topLeftPiece.y });
        topLeftPiece.x =
            finalImageInitialPosition.x +
                (finalImageFinalPosition.x - finalImageInitialPosition.x) *
                    easeOutElastic(TransitionController.finalMove);
        topLeftPiece.y =
            finalImageInitialPosition.y +
                (finalImageFinalPosition.y - finalImageInitialPosition.y) *
                    easeOutElastic(TransitionController.finalMove);
    }
    window.requestAnimationFrame(renderLoop);
}
