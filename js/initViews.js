export function initViews(params) {
  // Get views
  const challengeView = document.querySelector("[data-view='challenges']");
  const mechanismView = document.querySelector("[data-view='mechanisms']");
  const viewSwitch = document.querySelector("[data-view='switch']");

  // Init views
  function setView(view) {
    if (view === "challenges") {
      challengeView.style.display = "block";
      mechanismView.style.display = "none";
    } else if (view === "mechanisms") {
      challengeView.style.display = "none";
      mechanismView.style.display = "block";
    }
  }

  // Handle clicks
  viewSwitch.addEventListener("change", (event) => {
    console.log(event.target.checked);
    const view = event.target.checked ? "challenges" : "mechanisms";
    setView(view);
    // setView(view);
  });

  // Get switcher
  // Init switcher
  // Handle clicks
}
