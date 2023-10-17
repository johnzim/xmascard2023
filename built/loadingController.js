import { easeOutQuint } from "./easing.js";
class LoadingController {
    constructor() {
        this.count = 0;
        // The speed is initially set very low
        this.speed = 0.00018;
        this.loaded = false;
        this.getProgress = () => {
            return easeOutQuint(this.count);
        };
        this.setSpeed = (newSpeed) => {
            this.speed = newSpeed;
        };
        this.startLoading = () => {
            if (this.count === 0) {
                this._moveProgress();
            }
        };
        this._moveProgress = () => {
            this.count += this.speed;
            if (this.count < 1) {
                setTimeout(this._moveProgress, 1);
            }
        };
    }
}
export default new LoadingController();
