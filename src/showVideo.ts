export function showMessageVideo() {
  // Fade in the video contrainer
  const messageVideoContainer = document.getElementById(
    "message-video-container"
  ) as HTMLElement;
  messageVideoContainer.classList.add("shown");

  const messageVideo = document.getElementById(
    "message-video"
  ) as HTMLVideoElement;

  // Play once the video container has faded in
  setTimeout(() => {
    messageVideo.play();
  }, 800);

  // When the message is over, show the controls
  messageVideo.addEventListener("ended", () => {
    messageVideo.toggleAttribute("controls");
  });
}

export function loadMessageVideo() {
  const messageVideo = document.getElementById("message-video");
  messageVideo.setAttribute("src", "./img/message.mp4");
}
