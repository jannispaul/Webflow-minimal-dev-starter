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
    if (interactions === 0) {
      showMechanismToolTip(trigger);
    } else if (interactions === 1) {
      hideToolTips();
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
  }
  showChallengeToolTip();

  function showChallengeToolTip() {
    const tooltip = document.querySelector("[data-tooltip='challenge']");
    const challengeColumn = document.querySelector(".c_title-cell");
    const fistChallenge = document.querySelector(".c_first-cell");
    let target = window.innerWidth < 992 ? fistChallenge : challengeColumn;
    tooltip.style.position = "absolute";
    target.appendChild(tooltip);
    tooltip.style.display = "flex";
    tooltip.style.transform = "translateY(-100%)";
    document.addEventListener("click", hideToolTips, { once: true });
  }
  function showMechanismToolTip(trigger) {
    // hideToolTips();
    const tooltip = document.querySelector("[data-tooltip='mechanism']");
    const target = trigger.parentNode.querySelector("[data-source]");
    console.log(target);
    tooltip.style.position = "absolute";
    tooltip.style.zIndex = 2;
    target.appendChild(tooltip);
    tooltip.style.display = "flex";
    interactions++;
    // document.addEventListener("click", hideToolTips, { once: true });
  }
  function hideToolTips() {
    console.log("hiding");
    document.querySelectorAll("[data-tooltip]")[interactions].style.display = "none";
  }
}
