import "https://cdn.jsdelivr.net/npm/hls.js@1";
export function initVideo() {
  const video = document.querySelector("[data-element='video']");
  let hls;
  let videoSrc = video.src;
  if (Hls.isSupported()) {
    hls = new Hls();
    hls.loadSource(videoSrc);
    hls.attachMedia(video);
  }
  // Media source element supported on platforms that have HLS support
  else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = videoSrc;
  }

  // Trigger autoplay of video
  const videoTriggers = document.querySelectorAll("[data-dialog-trigger='video']");
  videoTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      //   video.load();
      video.play();
    });
  });

  // Stop playback when dialog closes
  const videoDialog = document.querySelector("[data-dialog='video']");
  videoDialog.addEventListener("close", (event) => {
    video.pause();
  });
}
