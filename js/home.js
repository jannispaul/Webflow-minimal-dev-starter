import { initDialogs } from "./initDialogs.js";
import { initVideo } from "./video.js";

document.addEventListener("DOMContentLoaded", async (event) => {
  initDialogs();
  initVideo();
  console.log("init dialogs");
});
