class TransitionController {
    constructor() {
        // Once the puzzle is finished the puzzle needs to move to the centre of the
        this.finalMove = 0;
        this.startFinalMove = () => {
            if (this.finalMove === 0) {
                this._moveFinalMove();
            }
        };
        this._moveFinalMove = () => {
            this.finalMove += 0.0018;
            if (this.finalMove < 1) {
                setTimeout(this._moveFinalMove, 1);
            }
        };
    }
}
export default new TransitionController();
