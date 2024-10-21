// Function to load mechanisms content from template pages
export async function loadMechanisms() {
  const buttons = document.querySelectorAll("[data-link]");

  // Fetch content from all links and store in object modals
  const modals = {};

  async function initModals() {
    const promises = Array.from(buttons).map(async (button) => {
      let slug = button.getAttribute("data-link");

      // If slug is not set, return
      if (!slug) {
        return;
      }

      // Create path from slug
      let url = "/mechanisms/" + slug;

      try {
        const html = await fetchContent(url);
        const content = extractModalContent(html);
        modals[slug] = content;
        createModalWithContent(content, slug);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    });

    await Promise.all(promises);
  }

  await initModals();

  async function fetchContent(url) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      return html;
    } catch (error) {
      console.error("Error fetching content:", error);
      return null;
    }
  }
  // Function to extract content with data-element="content"
  function extractModalContent(html) {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    const modalContentElement = tempElement.querySelector('[data-element="content"]');
    return modalContentElement ? modalContentElement.innerHTML : null;
  }

  // Function to create modal content with content
  function createModalWithContent(content, slug) {
    // Clone modal template
    const modalTemplate = document.querySelector("[data-element='dialog-template']");
    const modal = modalTemplate.cloneNode(true);
    const modalcontent = modal.querySelector("[data-element='dialog-content']");
    // Remove template attribute
    modal.removeAttribute("data-element");
    // Attach slug as data-dialog="slug"
    modal.setAttribute("data-dialog", slug);
    // Set modal content
    modalcontent.innerHTML = content;
    // Append modal to body
    document.body.appendChild(modal);
  }
  //   console.log("mechanisms loaded");
}
