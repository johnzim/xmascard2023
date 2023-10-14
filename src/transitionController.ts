class TransitionController {
  // Once the puzzle is finished the puzzle needs to move to the centre of the
  finalMove = 0;

  startFinalMove = () => {
    if (this.finalMove === 0) {
      this._moveFinalMove();
    }
  };

  _moveFinalMove = () => {
    this.finalMove += 0.0052;
    if (this.finalMove < 1) {
      setTimeout(this._moveFinalMove, 1);
    }
  };
}

export default new TransitionController();
