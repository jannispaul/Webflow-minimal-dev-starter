export function initFilter(params) {
  console.log("hi");
  const filterForms = document.querySelectorAll('form[data-view="filter"]');
  const challengeList = document.querySelector('[data-list="challenges"]');

  // Listen for changes on filter form
  filterForms.forEach((form) =>
    form.addEventListener("change", (event) => {
      const target = event.target;
      // If there is no value by default get the value from the input
      !target.value && (target.value = target.querySelector("input").value);
      updateList(target.value);
    })
  );

  // Filter the list
  function updateList(filterValue) {
    challengeList.childNodes.forEach((challenge) => {
      if (challenge.getAttribute("data-type").toLowerCase() === filterValue.toLowerCase() || filterValue === "all") {
        challenge.style.display = "inline-block"; // Needs to be inline-block for dynamic width on tablet and smaller
      } else {
        challenge.style.display = "none";
      }
    });
    let challengeTypeLabels = document.querySelectorAll("[data-type-label]");
    challengeTypeLabels.forEach((label) => {
      if (label.getAttribute("data-type-label").toLowerCase() === filterValue.toLowerCase()) {
        label.style.display = "block";
      } else {
        label.style.display = "none";
      }
    });
  }

  // Init filter
  filterForms[0].dispatchEvent(new Event("change"));
}
