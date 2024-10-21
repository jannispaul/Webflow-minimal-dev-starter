// // https://unpkg.com/video.js@7/dist/video.min.js
// import "https://unpkg.com/video.js@7/dist/video.min.js";
// export function initVideo() {
//   let video = document.querySelector("video-js");
//   let player = videojs(video, { responsive: true });
//   player.on("loadedmetadata", function () {
//     // Begin playing from the start of the video. (Required for 'f=hls-h264-rt'.)
//     player.currentTime(player.seekable().start(0));
//   });
//   player.src({
//     src: "https://upcdn.io/FW25cEo/video/test.mp4!f=hls-h264&h=480&h=1080&a=/video.m3u8",
//     type: "application/x-mpegURL",
//   });
// }

{
  /* <script src="https://cdn.jsdelivr.net/npm/hls.js@1"></script>
<!-- Or if you want the latest version from the main branch -->
<!-- <script src="https://cdn.jsdelivr.net/npm/hls.js@canary"></script> -->
<video id="video"></video>
<script>
  var video = document.getElementById('video');
  var videoSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
  if (Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource(videoSrc);
    hls.attachMedia(video);
  }
  // HLS.js is not supported on platforms that do not have Media Source
  // Extensions (MSE) enabled.
  //
  // When the browser has built-in HLS support (check using `canPlayType`),
  // we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video
  // element through the `src` property. This is using the built-in support
  // of the plain video element, without using HLS.js.
  else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = videoSrc;
  }
</script> */
}

import "https://cdn.jsdelivr.net/npm/hls.js@1";
export function initVideo() {
  const video = document.querySelector("[data-element='video']");
  let hls;
  let videoSrc = "https://upcdn.io/FW25cEo/video/test.mp4!f=hls-h264&h=480&h=1080&a=/video.m3u8";
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
