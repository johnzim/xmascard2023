import LoadingController from "./loadingController.js";
export function drawLoadingBar(ctx) {
    const barWidth = ctx.canvas.width / 2;
    const progressPercent = LoadingController.getProgress();
    if (progressPercent > 0.999 || LoadingController.count === 0) {
        return false;
    }
    ctx.fillStyle = '#222';
    ctx.fillRect((ctx.canvas.width * 0.5) - (barWidth * 0.5), ctx.canvas.height * 0.5, barWidth, 8);
    ctx.fillStyle = 'white';
    ctx.fillRect((ctx.canvas.width * 0.5) - (barWidth * 0.5) + 1, ctx.canvas.height * 0.5 + 1, barWidth * progressPercent - 2, 6);
    return true;
}
