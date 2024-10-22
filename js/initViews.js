import { getUrlParameter } from "./getURLParameter.js";
export function initViews(params) {
  // Get views
  const challengeView = document.querySelector("[data-view='challenges']");
  const mechanismView = document.querySelector("[data-view='mechanisms']");
  const viewSwitch = document.querySelector("[data-view='switch']");
  const bottomBarLegend = document.querySelector('[data-view="legend"]');
  const bottomBarGuide = document.querySelector('[data-view="guide"]');
  const navFilter = document.querySelector('[data-view="filter-wrap"]');
  const mechanismSlideList = document.querySelector('[data-list="mechanism-slides"]');
  // Set initial index for CSS animation
  mechanismSlideList.childNodes.forEach((slide, index) => {
    slide.style.setProperty("--index", `${index}`);
  });
  // Init views
  function setView(view) {
    if (view === "challenges") {
      challengeView.style.display = "flex";
      mechanismView.style.display = "none";
      bottomBarLegend.style.display = "flex";
      bottomBarGuide.style.display = "none";
      navFilter.style.display = "flex";
    } else if (view === "mechanisms") {
      challengeView.style.display = "none";
      mechanismView.style.display = "flex";
      bottomBarLegend.style.display = "none";
      bottomBarGuide.style.display = "flex";
      navFilter.style.display = "none";
    }
  }

  // Handle clicks
  viewSwitch.addEventListener("change", (event) => {
    event.target.checked === undefined && (event.target.checked = event.target.querySelector("input").checked);
    console.log(event.target.checked);

    const view = event.target.checked ? "challenges" : "mechanisms";
    setView(view);
    // setView(view);
  });

  // Init views
  viewSwitch.dispatchEvent(new Event("change"));

  const type = getUrlParameter("type");
  if (type == "mechanism") {
    setView("mechanisms");
    viewSwitch.querySelector("input").checked = false;
  }
}
