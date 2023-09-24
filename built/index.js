import { COLUMNS, ROWS } from "./constants.js";
import { Edge } from "./types.js";
import { bringToFront, getCursorPosition, getPieceForPosition, jumblePieces, setPieceEdges, } from "./utils.js";
import { renderPuzzlePiece } from "./drawPiece.js";
let canvas = null;
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
        });
    }
}
let clickStartPosition = { x: 0, y: 0 };
let offset = { x: 0, y: 0 };
let draggedPiece = null;
function getCanvas() {
    if (canvas) {
        return canvas;
    }
    return document.getElementById("cnv");
}
window.addEventListener("load", () => {
    const cnv = getCanvas();
    fitCanvas(cnv);
    registerMouseEvents(cnv);
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
function registerMouseEvents(canvas) {
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
