import { getPlayButtonPosition, getPlayButtonSize } from "./drawPlayButton.js";
export function isMouseClickInsidePlayButton(clickPosition, topLeftPiece) {
    const playButtonPosition = getPlayButtonPosition(topLeftPiece);
    const playButtonSize = getPlayButtonSize();
    // Triangles are square right? :D
    if (clickPosition.x > playButtonPosition.x &&
        clickPosition.x < playButtonPosition.x + playButtonSize &&
        clickPosition.y > playButtonPosition.y &&
        clickPosition.y < playButtonPosition.y + playButtonSize) {
        return true;
    }
    return false;
}
