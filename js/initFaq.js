export function initFAQ() {
  const triggers = document.querySelectorAll(".c_row-trigger");

  triggers.forEach((faqQuestion, i) => {
    // Initially set the height of the next sibling to 0px
    const sibling = faqQuestion.nextElementSibling;

    sibling.style.height = "0px";
    sibling.style.overflowY = "clip"; // Ensure content doesn't overflow during animation

    faqQuestion.addEventListener("click", handleClick);
    function handleClick(event) {
      toggleFaq(event.currentTarget);
    }
  });
  function toggleFaq(faqQuestion) {
    const sibling = faqQuestion.nextElementSibling;
    // Close other accordions when opening a new one
    if (!faqQuestion.classList.contains("open")) {
      document.querySelectorAll(".c_row-trigger.open").forEach((openQuestion) => {
        openQuestion.click();
      });
    }

    // Toggle the open class
    faqQuestion.classList.toggle("open");

    if (faqQuestion.classList.contains("open")) {
      // Open the content div if already closed
      sibling.style.height = "auto";
      let autoHeight = sibling.scrollHeight;
      sibling.style.height = "0px";

      sibling.animate([{ height: "0px" }, { height: autoHeight + "px" }], {
        duration: 400,
        easing: "ease",
      }).onfinish = function () {
        sibling.style.height = "auto";
      };
    } else {
      // Close the content div if already open
      let currentHeight = sibling.scrollHeight;

      sibling.animate([{ height: currentHeight + "px" }, { height: "0px" }], {
        duration: 400,
        easing: "ease",
      }).onfinish = function () {
        sibling.style.height = "0px";
      };
    }
  }
}
