// Import GSAP and ScrollTrigger
import gsap from "https://cdn.skypack.dev/gsap";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";

// Ensure GSAP plugins are registered
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", (event) => {
  // Function to initialize animations
  function initAnimation() {
    // Get target elements to animate
    const element = document.querySelector('[animate="element"]');

    if (!element) {
      console.error('No element found with attribute [animate="element"]');
      return; // Stop if no element is found
    }

    // Create a ScrollTrigger instance
    ScrollTrigger.create({
      trigger: element, // Element to trigger animation
      start: "top bottom", // When the top of the element hits the bottom of the viewport
      end: "bottom top", // When the bottom of the element hits the top of the viewport
      scrub: true, // Smooth scrubbing (controls the speed of the animation)
      markers: true, // Enable markers for easier debugging (remove in production)
      onEnter: () => console.log("Entered!"), // Optional: Logs when the element enters
      onLeave: () => console.log("Left!"), // Optional: Logs when the element leaves
    });

    // Create a timeline for the animation
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: element, // Same element that triggers the animation
        start: "top bottom", // Adjust for when you want the animation to start
        end: "bottom top", // Adjust for when you want the animation to end
        scrub: true, // Links the animation progress to scroll position
      },
    });

    // Define the animation steps on the timeline
    timeline
      // Set initial state of the element
      .set(element, { yPercent: -50, opacity: 0 })

      // Animate the element when scrolling into view
      .fromTo(
        element,
        { yPercent: -50, autoAlpha: 0 }, // From these properties
        { yPercent: 0, autoAlpha: 1, duration: 1.5, ease: "power3.inOut" } // To these properties
      );
  }

  // Initialize animations after DOM is ready
  initAnimation();

  // Resize handler: Refresh ScrollTrigger only on width change
  let lastWidth = window.innerWidth; // Store the initial width

  window.addEventListener("resize", () => {
    const currentWidth = window.innerWidth;

    // Only refresh if the width has changed
    if (currentWidth !== lastWidth) {
      lastWidth = currentWidth; // Update lastWidth with the new value
      ScrollTrigger.refresh(); // Refresh ScrollTriggers to account for width change
    }
  });

  // Optional: Utility to clean up when needed (for SPA or dynamic content)
  function cleanupAnimations() {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); // Kill all ScrollTriggers
  }

  // You can invoke cleanupAnimations if necessary (e.g., when navigating away in SPA)
});
