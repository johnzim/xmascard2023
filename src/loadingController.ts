import { easeOutQuint } from "./easing.js";

class LoadingController {
  count = 0;
  // The speed is initially set very low
  speed = 0.00018;

  getProgress = () => {
    return easeOutQuint(this.count);
  };


  setSpeed = (newSpeed: number) => {
    this.speed = newSpeed;
  };

  startLoading = () => {
    if (this.count === 0) {
      this._moveProgress();
    }
  };

  _moveProgress = () => {
    this.count += this.speed;
    if (this.count < 1) {
      setTimeout(this._moveProgress, 1);
    }
  };
}

export default new LoadingController();
