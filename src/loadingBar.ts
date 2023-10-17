import LoadingController from "./loadingController.js";

export function drawLoadingBar(ctx: CanvasRenderingContext2D): boolean {
  const barWidth = ctx.canvas.width / 2;
  const progressPercent = LoadingController.getProgress();

  if (LoadingController.loaded || LoadingController.count === 0) {
    return false;
  }

  ctx.fillStyle = "#222";
  ctx.fillRect(
    ctx.canvas.width * 0.5 - barWidth * 0.5,
    ctx.canvas.height * 0.5,
    barWidth,
    6
  );
  ctx.fillStyle = "white";
  ctx.fillRect(
    ctx.canvas.width * 0.5 - barWidth * 0.5,
    ctx.canvas.height * 0.5,
    barWidth * progressPercent,
    6
  );

  return true;
}
