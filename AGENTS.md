# AGENTS.md

Webflow project. Keep changes minimal and match what the site already does.

## Conventions

Follow the existing conventions of the website — class naming, spacing, components and slots. This project uses [Lumos](https://timothyricks.notion.site/Lumos-Framework-6d1139068f7442d49494ec3b581cf09d).

- Read the site's variables and style guide before writing anything.
- **Always prefer an existing variable.** If a value is close to one, use the variable — do not introduce a new one.
- Spacing in `rem`, never `px`.
- Build with components and slots rather than one-off structures.

## Custom JS

Written locally in `js/`, built and minified to `dist/` (`pnpm run build`), then embedded in Webflow.

- One file per component or feature. Modular and self-contained.
- Embed element gets the class `u-embed-js`.
- Inline the built script with `type="module"` and a `dev-src` pointing at the source file name:

```html
<script
  type="module"
  src="https://project.netlify.app/main.js"
  test-src="https://test--project.netlify.app/main.js"
  dev-src="http://localhost:5555/js/main.js"
></script>
```

- Modern JS: `const` / `let`, never `var`. CDN module imports are fine.
- **Do not import or register GSAP** — `gsap`, `ScrollTrigger` etc. are already global and registered in Webflow. Only use GSAP when asked.
- Clamp ScrollTriggers and add resize listeners.

## Custom CSS

- Embed element gets the class `u-embed-css`.
- Inline `<style>`, opened with a one-line comment saying what it does.

```html
<style>
  /* Sticky nav shrink on scroll */
</style>
```
