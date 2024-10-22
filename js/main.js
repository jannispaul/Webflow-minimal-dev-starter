import { initFAQ } from "./initFaq.js";
import { initSorting } from "./initSorting.js";
import { loadMechanisms } from "./loadMechanisms.js";
import { initDialogs } from "./initDialogs.js";
import { initViews } from "./initViews.js";
import { initFilter } from "./initFilter.js";
import { initVideo } from "./video.js";
import { initData } from "./initData.js";
import { hoverTable } from "./hoverTable.js";

document.addEventListener("DOMContentLoaded", async (event) => {
  initData();
  initFAQ();
  initViews();
  document.querySelector("main").style.opacity = "1";
  initFilter();
  initSorting();
  await loadMechanisms();
  initDialogs();
  initVideo();
  hoverTable();
});
