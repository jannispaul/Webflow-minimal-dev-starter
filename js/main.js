import { initFAQ } from "./initFaq.js";
import { initSorting } from "./initSorting.js";
import { loadMechanisms } from "./loadMechanisms.js";
import { initDialogs } from "./initDialogs.js";
import { initViews } from "./initViews.js";
import { initFilter } from "./initFilter.js";
import { initVideo } from "./video.js";
import { createMatrix } from "./createMatrix.js";

document.addEventListener("DOMContentLoaded", async (event) => {
  createMatrix();
  initFAQ();
  initViews();
  initFilter();
  initSorting();
  await loadMechanisms();
  initDialogs();
  initVideo();
});
