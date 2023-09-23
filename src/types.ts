
export interface PuzzlePiece extends Position {
  id: number;
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
