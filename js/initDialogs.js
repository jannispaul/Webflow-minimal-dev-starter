import { getUrlParameter } from "./getURLParameter.js";
export function initDialogs() {
  // Get all  dialog elements
  let dialogContentElements = document.querySelectorAll("[data-dialog]:not([data-dialog='close'])");

  //   console.log(dialogContentElements);
  // Create dialog from element and append it to body
  function createDialog(element) {
    let dialog = document.createElement("dialog");
    // Add element to dialog
    dialog.append(element);
    // Set dialog name
    dialog.setAttribute("data-dialog", element.getAttribute("data-dialog"));
    element.removeAttribute("data-dialog");
    document.body.append(dialog);
    dialog.addEventListener("close", (event) => {
      window.history.replaceState(null, null, "?");
    });
  }

  // Create Dialogs from dialog content elements
  dialogContentElements.forEach((element) => {
    createDialog(element);
  });

  // function to open the modal
  function openModal(slug) {
    // Select modal based on slug
    const modal = document.querySelector("[data-dialog='" + slug + "']");
    if (!modal) return;
    document.body.style.overflow = "hidden";
    modal.showModal();
    window.history.replaceState(null, null, "?name=" + slug);
  }

  function closeModal(slug) {
    console.log(slug);
    const modal = document.querySelector("[data-dialog='" + slug + "']").closest("dialog");
    document.body.style.overflow = "auto";
    modal.close();
    window.history.replaceState(null, null, "?");
  }

  const nameSlug = getUrlParameter("name");
  if (nameSlug) {
    openModal(nameSlug);
  }
  // Event listener for clicks
  document.addEventListener("click", function (event) {
    // Open on button click
    if (event.target.closest("[data-dialog-trigger]")) {
      let slug = event.target.closest("[data-dialog-trigger]").getAttribute("data-dialog-trigger");
      openModal(slug);
    }
    // close button click data-modal="close"
    if (event.target.closest("[data-dialog-element='close']")) {
      let slug = event.target.closest("dialog").getAttribute("data-dialog");
      closeModal(slug);
    }
    // Modal click does nothing
    if (event.target.closest("[data-dialog='content']")) return;
    // if event target is of type dialog close modal
    if (event.target.nodeName === "DIALOG") {
      let slug = event.target.closest("[data-dialog]").getAttribute("data-dialog");
      closeModal(slug);
    }
  });
}
