export function initFAQ() {
  const triggers = document.querySelectorAll("[data-collapse='trigger']");
  let interactions = 0;

  // Initially set the height of the next sibling to 0px
  triggers.forEach((trigger, i) => {
    const collapsable = trigger.parentNode.nextElementSibling;

    collapsable.style.height = "0px";
    collapsable.style.overflowY = "clip"; // Ensure content doesn't overflow during animation

    trigger.addEventListener("click", handleClick);
    function handleClick(event) {
      toggleFaq(event.currentTarget);
    }
  });
  function toggleFaq(trigger) {
    // After first interaction show mechanismtooltip
    if (interactions === 0) {
      showMechanismToolTip(trigger);
    }
    const collapsable = trigger.parentNode.nextElementSibling;
    // Close other accordions when opening a new one
    if (!trigger.parentNode.classList.contains("open")) {
      document.querySelectorAll(".open").forEach((trigger) => {
        trigger.children[0].click();
      });
    }

    // Toggle the open class
    trigger.parentNode.classList.toggle("open");

    if (trigger.parentNode.classList.contains("open")) {
      // Open the content div if already closed
      collapsable.style.height = "auto";
      let autoHeight = collapsable.scrollHeight;
      collapsable.style.height = "0px";

      collapsable.animate([{ height: "0px" }, { height: autoHeight + "px" }], {
        duration: 400,
        easing: "ease",
      }).onfinish = function () {
        collapsable.style.height = "auto";
      };
    } else {
      // Close the content div if already open
      let currentHeight = collapsable.scrollHeight;

      collapsable.animate([{ height: currentHeight + "px" }, { height: "0px" }], {
        duration: 400,
        easing: "ease",
      }).onfinish = function () {
        collapsable.style.height = "0px";
      };
    }
    updateColumns(trigger);
  }

  // Function to update column text colors based on open state and impact
  function updateColumns(trigger) {
    // Get Items
    const row = trigger.closest(".c_row-wrap");
    const isOpen = trigger.closest(".open");
    const titleCells = Array.from(document.querySelector("[data-list='mechanisms']").childNodes);

    // Check if open
    if (isOpen) {
      // Get irrelevant items,
      let irrelavantItems = row.querySelectorAll("[data-impact='Not Relevant']");
      irrelavantItems.forEach((item) => {
        // Get index of item and color title cells, shift index by 1, because of CMS list
        let index = Array.from(item.parentNode.childNodes).indexOf(item);
        titleCells[index - 1].style.color = "rgba(173, 173, 173, 1)";
      });
    } else {
      // On close, reset all cell colors
      titleCells.forEach((cell) => {
        cell.style.color = "";
      });
    }
    row.querySelectorAll("[data-impact='Not Relevant']");
  }
  showChallengeToolTip();

  function showChallengeToolTip() {
    const tooltip = document.querySelector("[data-tooltip='challenge']");
    const challengeColumn = document.querySelector(".c_title-cell");
    const fistChallenge = document.querySelector(".c_first-cell");
    let target = window.innerWidth < 992 ? fistChallenge : challengeColumn;
    tooltip.style.position = "absolute";
    tooltip.style.display = "flex";
    tooltip.style.transform = "translateY(-100%)";
    target.appendChild(tooltip);
    // Any click closes the tooltip
    document.addEventListener("click", hideToolTips, { once: true, capture: true });
  }
  function showMechanismToolTip(trigger) {
    const tooltip = document.querySelector("[data-tooltip='mechanism']");
    const target = trigger.parentNode.querySelector("[data-source]");
    tooltip.style.position = "absolute";
    tooltip.style.zIndex = 2;
    tooltip.style.display = "flex";
    tooltip.style.transform = "translateY(-100%)";
    target.appendChild(tooltip);
    interactions++;
    // Any click closes the tooltip
    document.addEventListener("click", hideToolTips, { once: true, capture: true });
  }
  function hideToolTips() {
    Array.from(document.querySelectorAll("[data-tooltip]"))[interactions].style.display = "none";
  }
}
