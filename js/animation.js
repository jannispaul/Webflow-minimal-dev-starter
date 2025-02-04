import gsap from 'https://cdn.skypack.dev/gsap';
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.fromTo(
    ".animation-text",
    { opacity: 0, y: 100 },
    { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: ".animation-text", start: "top bottom", end: "bottom top", scrub: true } }
);