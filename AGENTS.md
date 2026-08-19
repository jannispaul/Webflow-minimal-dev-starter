# AGENTS.md

Webflow project. Keep changes minimal and match what the site already does.

## Conventions

Follow the existing conventions of the website — class naming, spacing, components and slots. This project uses [Lumos](https://timothyricks.notion.site/Lumos-Framework-6d1139068f7442d49494ec3b581cf09d).

- Read the site's variables and style guide before writing anything.
- **Always prefer an existing variable.** If a value is close to one, use the variable — do not introduce a new one.
- Spacing in `rem`, never `px`.
- Build with components and slots rather than one-off structures.

## Custom JS

Write the source locally in `js/` — one file per component or feature, modular and self-contained. Build with `pnpm run build`, which minifies each file to `dist/`.

- Modern JS: `const` / `let`, never `var`. CDN module imports are fine.
- **Do not import or register GSAP** — `gsap`, `ScrollTrigger` etc. are already global and registered in Webflow. Only use GSAP when asked.
- Clamp ScrollTriggers and add resize listeners.

### Embedding (default)

Paste the built `dist/<name>.js` **inline** into a Webflow embed. The embed element gets the class `u-embed-js`. The script is `type="module"`, with `dev-src` naming the source file so the dev proxy can swap in localhost while you work:

```html
<script type="module" dev-src="main.js">
  console.log(`start here`);
</script>
```

Rebuild and re-paste when the source changes.

### Embedding (alternative: hosted)

Only when the project hosts its built files — see "Option B" in the readme. Same `u-embed-js` class, but the script points at URLs instead of carrying the code:

```html
<script
  type="module"
  src="https://project.netlify.app/main.js"
  test-src="https://test--project.netlify.app/main.js"
  dev-src="http://localhost:5555/js/main.js"
></script>
```

## Custom CSS

- Embed element gets the class `u-embed-css`.
- Inline `<style>`, opened with a one-line comment saying what it does.

```html
<style>
  /* Sticky nav shrink on scroll */
</style>
```
