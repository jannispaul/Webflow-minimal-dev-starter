# AGENTS.md

Webflow project built on [Lumos](https://timothyricks.notion.site/Lumos-Framework-6d1139068f7442d49494ec3b581cf09d). Keep changes minimal and match what the site already does. This file is the single source of truth — `CLAUDE.md` and the Cursor rule point here.

## Workflow

1. **Read before writing.** Use the Webflow MCP server (`webflow-<repo-name>` in `.mcp.json`) to inspect the site's variables, classes, components and style guide first.
2. **Prefer Webflow over code.** Solve it with existing components, variables and classes in Webflow. Reach for custom CSS, then custom JS, only when Webflow can't do it.
3. **Page and section work** ("add a hero", "build a pricing section") — use the `webflow-lumos-pages` skill: compose from existing components, never author new ones.
4. **If the design needs something the system can't express, stop and ask.** Don't patch around it.

## Webflow conventions

- Follow the site's existing class naming, spacing, components and slots.
- **Always use an existing variable.** If a value is close to one, use the variable — never introduce a new one.
- Spacing in `rem`, never `px`.
- Build with components and slots, not one-off structures.
- Never use native Webflow Button or Form elements. Use a custom element with the tag set to `button`, `form`, `input`, `details`, etc.
- Designer-only styling (e.g. revealing hidden elements for content editing) goes under `.wf-design-mode`.

## Commands

| Command          | What it does                                             |
| ---------------- | -------------------------------------------------------- |
| `pnpm run dev`   | Vite dev server at `http://localhost:5555`               |
| `pnpm run build` | Minifies each `js/<name>.js` to `dist/<name>.js`         |

Preview local code on the live site via the dev proxy: `https://dev.arise.so/?url=https://project.webflow.io`.

Branches: `develop` (active work) → `main` (production).

## Custom JS

Source lives in `js/`, one file per component or feature. Each file builds to its own `dist/<name>.js`. `dist/` is gitignored build output — never edit it by hand.

- Modern ES modules: `const` / `let`, never `var`. CDN module imports are fine.
- Self-contained: no globals, no cross-file dependencies. Exit early if the target elements aren't on the page.
- Select elements with `data-` attributes, not styling classes — classes get renamed in the Designer.
- Small functions, JSDoc on anything non-trivial, descriptive names (`isOpen`, `hasLoaded`).
- `console` calls are kept in the build on purpose (debugging in Webflow); `debugger` is stripped.

### Embedding

Paste the built `dist/<name>.js` **inline** into an Embed element with the class `u-embed-js`. Use `type="module"` and set `dev-src` to the source filename so the dev proxy can swap in localhost:

```html
<script type="module" dev-src="main.js">
  /* contents of dist/main.js */
</script>
```

Rebuild and re-paste whenever the source changes.

## Custom CSS

Write as little as possible — Webflow classes and variables come first.

- Source lives in `css/`, one file per component or feature. CSS isn't built — paste it as is.
- Paste into an Embed element with the class `u-embed-css`, wrapped in `<style>` and opened with a one-line comment saying what it does and the local file name.
- Use the site's CSS variables, never hardcoded values.

```html
<style>
  /* Sticky nav shrink on scroll */
</style>
```

## Animations

- Prefer cheap animations: CSS over JS, `transform` / `opacity` over layout properties.
- Respect `prefers-reduced-motion`.
- **Only use GSAP when asked.** `gsap`, `ScrollTrigger` and other plugins are already loaded and registered by Webflow — never import or register them.
- ScrollTrigger: clamp `start` / `end` (`clamp()`) and recalculate layout-dependent values on resize (debounced). Use `gsap.matchMedia()` for breakpoint-specific animations.