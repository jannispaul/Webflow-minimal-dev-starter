import { initDialogs } from "./initDialogs";
import { initVideo } from "./video";

document.addEventListener("DOMContentLoaded", async (event) => {
  initDialogs();
  initVideo();
  console.log("init dialogs");
});
