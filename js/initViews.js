export function initViews(params) {
  // Get views
  const challengeView = document.querySelector("[data-view='challenges']");
  const mechanismView = document.querySelector("[data-view='mechanisms']");
  const viewSwitch = document.querySelector("[data-view='switch']");
  const bottomBarLegend = document.querySelector('[data-view="legend"]');
  const bottomBarGuide = document.querySelector('[data-view="guide"]');

  // Init views
  function setView(view) {
    if (view === "challenges") {
      challengeView.style.display = "block";
      mechanismView.style.display = "none";
      bottomBarLegend.style.display = "flex";
      bottomBarGuide.style.display = "none";
    } else if (view === "mechanisms") {
      challengeView.style.display = "none";
      mechanismView.style.display = "block";
      bottomBarLegend.style.display = "none";
      bottomBarGuide.style.display = "flex";
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

  // Get switcher
  // Init switcher
  // Handle clicks
}
