import { PIECE_SIZE } from "./constants.js";
export function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
}
export function getPieceForPosition(position, pieces) {
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
export function bringToFront(piece, pieces) {
    const index = pieces.indexOf(piece);
    if (index === -1) {
        throw new Error("Attempted to bring piece to front which wasn't in the pieces passed to bringToFront!");
    }
    pieces.push(pieces.splice(index, 1)[0]);
}
export function jumblePieces(pieces) {
    // find mid point of canvas
    // find max jumble distance
    // scatter x and y randomly
}
export var Corner;
(function (Corner) {
    Corner["topLeft"] = "TOP_LEFT";
    Corner["topRight"] = "TOP_RIGHT";
    Corner["bottomLeft"] = "BOTTOM_LEFT";
    Corner["bottomRight"] = "BOTTOM_RIGHT";
})(Corner || (Corner = {}));
export function getCornerPosition(piece, corner) {
    switch (corner) {
        case Corner.bottomLeft:
            return { x: piece.x, y: piece.y + PIECE_SIZE };
        case Corner.topLeft:
            return { x: piece.x, y: piece.y };
        case Corner.topRight:
            return { x: piece.x + PIECE_SIZE, y: piece.y };
        case Corner.bottomRight:
            return { x: piece.x + PIECE_SIZE, y: piece.y + PIECE_SIZE };
    }
}
