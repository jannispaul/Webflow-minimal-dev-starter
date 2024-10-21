// Function create mechanism sorting functionality
export function initSorting() {
  // Get form elements
  const form = document.querySelector('form[data-name="sorting"]');
  const sortingInputs = form.querySelectorAll('input[type="checkbox"]');
  const bottomBarGuide = document.querySelector('[data-view="guide"]');
  const bottomBarLegend = document.querySelector('[data-view="legend"]');
  const mechanismSlideList = document.querySelector('[data-list="mechanism-slides"]');
  const moreSlide = document.querySelector('[data-element="more-slide"]');
  // Listen for changes on form
  form.addEventListener("change", handleSorting);

  mechanismSlideList.appendChild(moreSlide);

  // Reset sorting by data-sort attribute
  function resetSorting() {
    const mechanismSlides = Array.from(mechanismSlideList.querySelectorAll("[data-mechanism]"));

    // Sort mechanismSlides based on original sorting
    mechanismSlides.sort((a, b) => {
      const aSorting = a.getAttribute("data-sort");
      const bSorting = b.getAttribute("data-sort");
      return aSorting - bSorting;
    });

    // Reset impact status
    mechanismSlideList.querySelectorAll("[data-challenge]").forEach((impact) => (impact.style.display = "none"));
    // Empty List
    mechanismSlideList.innerHTML = "";
    // Set items in list
    mechanismSlides.forEach((slide) => {
      mechanismSlideList.appendChild(slide);
      slide.style.opacity = 1;
    });
    mechanismSlideList.append(moreSlide);

    mechanismSlideList.classList.remove("sorted");
    bottomBarGuide.style.display = "flex";
    bottomBarLegend.style.display = "none";
  }

  function handleSorting(event) {
    const target = event.target;

    if (!form.querySelector("input:checked")) {
      resetSorting();
    } else {
      onlyOne(target);
      const challengeSlug = target.closest("[data-challenge]").getAttribute("data-challenge");
      sortMechanismsByImpact(challengeSlug);
    }
  }

  // Function to only allow one checkbox to be checked
  function onlyOne(checkbox) {
    sortingInputs.forEach((item) => {
      if (item !== checkbox) {
        item.checked = false;
      }
    });
  }

  // Function to sort mechanisms by challenge impact
  function sortMechanismsByImpact(challengeSlug) {
    console.log(`Sorting mechanisms by ${challengeSlug}`);

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

      // Set opactity if slide is not relevant
      slide.querySelector(`[data-challenge="${challengeSlug}"]`).getAttribute("data-impact") === "Not Relevant" ? (slide.style.opacity = 0.3) : (slide.style.opacity = 1);

      mechanismSlideList.appendChild(slide);
    });
    mechanismSlideList.classList.add("sorted");
    bottomBarGuide.style.display = "none";
    bottomBarLegend.style.display = "flex";
  }
}
