export function createMatrix(params) {
  // Remove all hidden webflow artifacts
  Array.from(document.querySelectorAll(".w-condition-invisible")).forEach((node) => node.remove());

  // Setup tables
  function organizeChallengeMechanismTable() {
    // Get the order of mechanisms
    const mechanisms = Array.from(document.querySelectorAll('[data-list="mechanisms"] [data-mechanism]')).map((el) => el.getAttribute("data-mechanism"));

    // Get the order of challenges
    const challenges = Array.from(document.querySelectorAll('[data-list="challenges"] [data-challenge]'));
    const challengesSlugs = challenges.map((el) => el.getAttribute("data-challenge"));

    // Get all data items from the challenges x mechanisms list
    const dataItems = Array.from(document.querySelectorAll('[data-list="data"] [data-mechanism][data-challenge]'));

    addImpactToMechanisms(dataItems);

    // Sort the data items based on the order of mechanisms
    dataItems.sort((a, b) => {
      const mechanismA = a.getAttribute("data-mechanism");
      const mechanismB = b.getAttribute("data-mechanism");
      return mechanisms.indexOf(mechanismA) - mechanisms.indexOf(mechanismB);
    });

    // Iterate over each data item and place it in the appropriate container
    dataItems.forEach((item) => {
      const itemMechanism = item.getAttribute("data-mechanism");
      const itemChallenge = item.getAttribute("data-challenge");
      const itemSourceTop = item.querySelector("[data-source='impact']");
      const itemSourceBottom = item.querySelector("[data-source='impact-description']");

      // Find the target container based on challenge and mechanism
      const challengeIndex = challengesSlugs.indexOf(itemChallenge);
      const mechanismIndex = mechanisms.indexOf(itemMechanism);

      if (challengeIndex === -1 || mechanismIndex === -1) {
        console.warn(`Challenge "${itemChallenge}" or Mechanism "${itemMechanism}" not found in the lists.`);
        return;
      }

      // Get the appropriate target container based on data-target (top or bottom)
      const challengeRow = challenges[challengeIndex];
      const targetTopContainer = challengeRow.querySelector(`[data-target="top"]`);
      const targetBottomContainer = challengeRow.querySelector(`[data-target="bottom"]`);

      if (targetTopContainer && targetBottomContainer) {
        // Place the data item in the appropriate container
        targetTopContainer.appendChild(itemSourceTop);
        targetBottomContainer.appendChild(itemSourceBottom);
      } else {
        console.warn(`Target container not found for data-target="${itemSource}" in challenge "${itemChallenge}".`);
      }
    });
    // Remove data-list="data"
    document.querySelector('[data-list="data"]').parentNode.remove();
  }

  // Call the function to execute the organization
  organizeChallengeMechanismTable();

  // Function to add impact to mechanisms
  function addImpactToMechanisms(dataItems) {
    // Get item relevant to mechanisms
    const sortingItems = Array.from(document.querySelectorAll('[data-list="sorting"] [data-challenge]'));
    const challengeSlugs = sortingItems.map((el) => el.getAttribute("data-challenge"));
    const mechanismSlides = Array.from(document.querySelectorAll('[data-list="mechanism-slides"] [data-mechanism]'));

    // If item is in sortingItemsSlugs, add it to the appropriate mechanism slide
    dataItems.forEach((item) => {
      const itemChallenge = item.getAttribute("data-challenge");
      // Check if item has challgen slug
      if (challengeSlugs.includes(itemChallenge)) {
        const itemMechanism = item.getAttribute("data-mechanism");
        const mechanismSlide = mechanismSlides.find((slide) => slide.getAttribute("data-mechanism") === itemMechanism);
        const nestTarget = mechanismSlide?.querySelector("[data-target='impact']");
        if (nestTarget) {
          // Clone the item and add it to the target
          const clonedImpact = item.querySelector("[data-source='impact']").cloneNode(true);
          clonedImpact.classList.remove("cell");
          clonedImpact.style.display = "none";
          nestTarget.appendChild(clonedImpact);
        }
      }
    });
  }
}
