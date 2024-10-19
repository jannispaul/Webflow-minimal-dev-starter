export function initFilter(params) {
  const filterForm = document.querySelector('form[data-view="filter"]');
  const challengeList = document.querySelector('[data-list="challenges"]');

  // Listen for changes on filter form
  filterForm.addEventListener("change", (event) => {
    const target = event.target;
    console.log(target);
    console.log(target.value);
    !target.value && (target.value = target.querySelector("input").value);
    updateFilter(target.value);
  });
  function updateFilter(filterValue) {
    challengeList.childNodes.forEach((challenge) => {
      if (challenge.getAttribute("data-type").toLowerCase() === filterValue.toLowerCase() || filterValue === "all") {
        challenge.style.display = "block";
      } else {
        challenge.style.display = "none";
      }
    });
  }
  // Init filter
  filterForm.dispatchEvent(new Event("change"));
}
