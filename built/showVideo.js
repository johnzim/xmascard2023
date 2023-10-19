export function showMessageVideo() {
    // Fade in the video contrainer
    const messageVideoContainer = document.getElementById("message-video-container");
    messageVideoContainer.classList.add("shown");
    const messageVideo = document.getElementById("message-video");
    // Play once the video container has faded in
    setTimeout(() => {
        messageVideo.play();
    }, 800);
    // When the message is over, show the controls
    messageVideo.addEventListener("ended", () => {
        messageVideo.toggleAttribute("controls");
    });
}
