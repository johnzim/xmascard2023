class LoadingController {
    constructor() {
        this.progress = 0;
        this.speed = 0.0018;
        this.setSpeed = () => {
            this.progress;
        };
        this.startLoading = () => {
            if (this.progress === 0) {
                this._moveProgress();
            }
        };
        this._moveProgress = () => {
            console.log(this.progress);
            this.progress += this.speed;
            if (this.progress < 1) {
                setTimeout(this._moveProgress, 1);
            }
        };
    }
}
export default new LoadingController();
