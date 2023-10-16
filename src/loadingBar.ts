import loadingController from "./loadingController.js";

export function drawLoadingBar(ctx: CanvasRenderingContext2D) {
  const barWidth = ctx.canvas.width / 2;
  const progressPercent = loadingController.getProgress();

  if (progressPercent > 0.999 || loadingController.count === 0) {
    return;
  }

  ctx.fillStyle = 'black';
  ctx.fillRect((ctx.canvas.width * 0.5) - (barWidth * 0.5), ctx.canvas.height * 0.5, barWidth, 10);
  ctx.fillStyle = 'white';
  ctx.fillRect((ctx.canvas.width * 0.5) - (barWidth * 0.5) + 1, ctx.canvas.height * 0.5 + 1, barWidth * progressPercent - 2, 8);

}
