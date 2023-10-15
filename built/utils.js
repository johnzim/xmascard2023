import { COLUMNS, ROWS } from "./constants.js";
import { isTouchDevice } from "./index.js";
import { Corner, Edge } from "./types.js";
export function deviceAppropriatePieceSize() {
    // work out what the max/height width should be.
    // ideally the jigsaw should take up 1/2 of the screen size/width
    let puzzleWidth = window.innerWidth;
    if (isTouchDevice) {
        return forceEven(Math.round((puzzleWidth * 0.8) / COLUMNS));
    }
    return forceEven(Math.round((puzzleWidth * 0.5) / COLUMNS));
}
function forceEven(x) {
    if (x % 2 !== 0) {
        return x + 1;
    }
    return x;
}
export function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX ||
        event.touches[0].clientX) - rect.left;
    const y = (event.clientY ||
        event.touches[0].clientY) - rect.top;
    return { x, y };
}
export function getPieceForPosition(position, pieces) {
    // working from front to back check which piece is valid
    for (let i = pieces.length - 1; i > -1; i--) {
        let piece = pieces[i];
        if (position.x < piece.x + deviceAppropriatePieceSize() &&
            position.x >= piece.x) {
            if (position.y < piece.y + deviceAppropriatePieceSize() &&
                position.y >= piece.y) {
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
export function jumblePieces(canvas, puzzlePieces) {
    // scatter x and y randomly
    puzzlePieces.forEach((piece) => {
        piece.x = Math.floor(Math.random() * (canvas.width - deviceAppropriatePieceSize()));
        piece.y = Math.floor(Math.random() * (canvas.height - deviceAppropriatePieceSize()));
    });
}
export function getCornerPosition(piece, corner) {
    switch (corner) {
        case Corner.BOTTOM_LEFT:
            return { x: piece.x, y: piece.y + deviceAppropriatePieceSize() };
        case Corner.TOP_LEFT:
            return { x: piece.x, y: piece.y };
        case Corner.TOP_RIGHT:
            return { x: piece.x + deviceAppropriatePieceSize(), y: piece.y };
        case Corner.BOTTOM_RIGHT:
            return {
                x: piece.x + deviceAppropriatePieceSize(),
                y: piece.y + deviceAppropriatePieceSize(),
            };
    }
}
function getRandomNonFlatEdge() {
    const roll = Math.floor(Math.random() * 2);
    if (roll === 0) {
        return Edge.INNY;
    }
    return Edge.OUTY;
}
function oppositeEdge(edge) {
    if (!edge) {
        return Edge.FLAT;
    }
    else if (edge === Edge.INNY) {
        return Edge.OUTY;
    }
    else if (edge === Edge.OUTY) {
        return Edge.INNY;
    }
    else if (edge === Edge.FLAT) {
        return getRandomNonFlatEdge();
    }
}
export function setPieceEdges(pieces) {
    pieces.forEach((piece) => {
        const above = getPieceAbove(piece, pieces);
        const below = getPieceBelow(piece, pieces);
        const left = getPieceLeft(piece, pieces);
        const right = getPieceRight(piece, pieces);
        piece.top = oppositeEdge(above === null || above === void 0 ? void 0 : above.bottom);
        piece.bottom = oppositeEdge(below === null || below === void 0 ? void 0 : below.top);
        piece.left = oppositeEdge(left === null || left === void 0 ? void 0 : left.right);
        piece.right = oppositeEdge(right === null || right === void 0 ? void 0 : right.left);
    });
}
function getPieceAbove(piece, pieces) {
    const rowNumber = Math.floor(piece.id / COLUMNS);
    if (rowNumber === 0) {
        // Top row, can't be any piece above
        return null;
    }
    const id = piece.id - COLUMNS;
    return pieces.find((x) => x.id === id);
}
function getPieceBelow(piece, pieces) {
    const rowNumber = Math.floor(piece.id / COLUMNS);
    if (rowNumber === ROWS - 1) {
        // Bottom row, can't be any piece below
        return null;
    }
    const id = piece.id + COLUMNS;
    return pieces.find((x) => x.id === id);
}
function getPieceLeft(piece, pieces) {
    const columnNumber = piece.id % COLUMNS;
    if (columnNumber === 0) {
        // left most column, can't be any piece to the left
        return null;
    }
    const id = piece.id - 1;
    return pieces.find((x) => x.id === id);
}
function getPieceRight(piece, pieces) {
    const columnNumber = piece.id % COLUMNS;
    if (columnNumber === COLUMNS - 1) {
        // right most column, can't be any piece to the right
        return null;
    }
    const id = piece.id + 1;
    return pieces.find((x) => x.id === id);
}
function distanceBetweenPositions(A, B) {
    return Math.abs(A.x - B.x) + Math.abs(A.y - B.y);
}
export function addNearbyPiece(piece, pieces) {
    let connectedPosition = null;
    const fitDistance = isTouchDevice ? deviceAppropriatePieceSize() * 0.2 : deviceAppropriatePieceSize() * 0.1;
    if (piece.top !== Edge.FLAT && !piece.connected.top) {
        const above = getPieceAbove(piece, pieces);
        const fitPosition = {
            x: above.x,
            y: above.y + deviceAppropriatePieceSize(),
        };
        if (above && distanceBetweenPositions(piece, fitPosition) < fitDistance) {
            piece.connected.top = above;
            above.connected.bottom = piece;
            connectedPosition = fitPosition;
        }
    }
    if (piece.bottom !== Edge.FLAT && !piece.connected.bottom) {
        const below = getPieceBelow(piece, pieces);
        const fitPosition = {
            x: below.x,
            y: below.y - deviceAppropriatePieceSize(),
        };
        if (below && distanceBetweenPositions(piece, fitPosition) < fitDistance) {
            piece.connected.bottom = below;
            below.connected.top = piece;
            connectedPosition = fitPosition;
        }
    }
    if (piece.left !== Edge.FLAT && !piece.connected.left) {
        const left = getPieceLeft(piece, pieces);
        const fitPosition = { x: left.x + deviceAppropriatePieceSize(), y: left.y };
        if (left && distanceBetweenPositions(piece, fitPosition) < fitDistance) {
            piece.connected.left = left;
            left.connected.right = piece;
            connectedPosition = fitPosition;
        }
    }
    if (piece.right !== Edge.FLAT && !piece.connected.right) {
        const right = getPieceRight(piece, pieces);
        const fitPosition = {
            x: right.x - deviceAppropriatePieceSize(),
            y: right.y,
        };
        if (right && distanceBetweenPositions(piece, fitPosition) < fitDistance) {
            piece.connected.right = right;
            right.connected.left = piece;
            connectedPosition = fitPosition;
        }
    }
    if (connectedPosition) {
        moveIfNew(piece, connectedPosition);
    }
}
export function moveIfNew(piece, newPosition) {
    if (newPosition.x !== piece.x || newPosition.y !== piece.y) {
        piece.x = newPosition.x;
        piece.y = newPosition.y;
        moveAllConnectedPieces(piece);
    }
}
export function moveAllConnectedPieces(draggedPiece) {
    if (draggedPiece.connected.top) {
        const newPosition = {
            x: draggedPiece.x,
            y: draggedPiece.y - deviceAppropriatePieceSize(),
        };
        moveIfNew(draggedPiece.connected.top, newPosition);
    }
    if (draggedPiece.connected.bottom) {
        const newPosition = {
            x: draggedPiece.x,
            y: draggedPiece.y + deviceAppropriatePieceSize(),
        };
        moveIfNew(draggedPiece.connected.bottom, newPosition);
    }
    if (draggedPiece.connected.left) {
        const newPosition = {
            x: draggedPiece.x - deviceAppropriatePieceSize(),
            y: draggedPiece.y,
        };
        moveIfNew(draggedPiece.connected.left, newPosition);
    }
    if (draggedPiece.connected.right) {
        const newPosition = {
            x: draggedPiece.x + deviceAppropriatePieceSize(),
            y: draggedPiece.y,
        };
        moveIfNew(draggedPiece.connected.right, newPosition);
    }
}
export function hasPuzzleFinished(pieces) {
    let missingEdge = false;
    for (const piece of pieces) {
        if (piece.top !== Edge.FLAT && !piece.connected.top) {
            missingEdge = true;
            break;
        }
        if (piece.bottom !== Edge.FLAT && !piece.connected.bottom) {
            missingEdge = true;
            break;
        }
        if (piece.left !== Edge.FLAT && !piece.connected.left) {
            missingEdge = true;
            break;
        }
        if (piece.right !== Edge.FLAT && !piece.connected.right) {
            missingEdge = true;
            break;
        }
    }
    return !missingEdge;
}
