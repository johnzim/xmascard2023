
export interface PuzzlePiece extends Position {
  id: number;
  top: Edge;
  bottom: Edge;
  right: Edge;
  left: Edge;
}

export interface Position {
  x: number;
  y: number;
}

export enum Facing {
  RIGHT = "RIGHT",
  LEFT = "LEFT",
  UP = "UP",
  DOWN = "DOWN",
}

export enum Edge {
  INNY = "INNY",
  OUTY = "OUTY",
  FLAT = "FLAT",
}

export enum Corner {
  TOP_LEFT = "TOP_LEFT",
  TOP_RIGHT = "TOP_RIGHT",
  BOTTOM_LEFT = "BOTTOM_LEFT",
  BOTTOM_RIGHT = "BOTTOM_RIGHT",
}

