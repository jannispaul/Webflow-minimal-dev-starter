export function initSorting() {
  // Get form elements
  const form = document.querySelector('form[data-name="sorting"]');
  const sortingRadios = form.querySelectorAll('input[type="radio"]');

  // Add event listener to each radio button
  sortingRadios.forEach((radio) => radio.addEventListener("change", handleSorting));

  //Listen for changes
  //   form.addEventListener("change", handleSorting);
  function handleSorting(event) {
    const target = event.target;

    // TODO
    // Handle uncheck
    // Update bottom Bar

    // Check if target is already checked
    if ((target.name = "uncheck")) {
      console.log(target, "Already checked");
    } else {
      const challengeSlug = target.closest("[data-challenge]").getAttribute("data-challenge");
      sortMechanismsByImpact(challengeSlug);
    }
  }

  // Function to sort mechanisms by challenge impact
  function sortMechanismsByImpact(challengeSlug) {
    const mechanismSlideList = document.querySelector('[data-list="mechanism-slides"]');
    const mechanismSlides = Array.from(mechanismSlideList.querySelectorAll('[data-list="mechanism-slides"] [data-mechanism]'));
    // Sorting order
    const sortingReference = ["High", "Medium", "Not Relevant"];

    // Empty list
    mechanismSlideList.innerHTML = "";

    // Sort mechanismSlides based on their impact
    mechanismSlides.sort((a, b) => {
      const aImpact = a.querySelector(`[data-challenge="${challengeSlug}"]`);
      const bImpact = b.querySelector(`[data-challenge="${challengeSlug}"]`);
      const aImpactIndex = sortingReference.indexOf(aImpact?.getAttribute("data-impact"));
      const bImpactIndex = sortingReference.indexOf(bImpact?.getAttribute("data-impact"));
      return aImpactIndex - bImpactIndex;
    });

    // Update slides
    mechanismSlides.forEach((slide) => {
      slide.querySelectorAll("[data-challenge]").forEach((impact) => (impact.style.display = "none"));
      slide.querySelector(`[data-challenge="${challengeSlug}"]`).style.display = "flex";
      mechanismSlideList.appendChild(slide);
    });
  }
}
