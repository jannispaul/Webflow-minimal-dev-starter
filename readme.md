# Minimal Webflow Development Starter

Repository template that uses [vite](https://vitejs.dev/) to run a dev server and minify output for Webflow.

## Setup

Use with setup script `new-webflow-project project-name`

```
gh repo create "$PROJECT_NAME" \
  --template jannispaul/Webflow-minimal-dev-starter \
  --private \
  --include-all-branches \
  --clone
```

Then install once. `postinstall` replaces the `PROJECT_NAME` placeholders with the repo name, so the Webflow MCP server becomes `webflow-<repo-name>` in `.mcp.json` and is pre-allowed in `.claude/settings.json`:

```
pnpm install
```

Updating a project created from an older version of this template? See [docs/UPGRADING.md](docs/UPGRADING.md).

## Conventions

[AGENTS.md](AGENTS.md) is the single source of truth for coding conventions (Lumos, variables, embeds). `CLAUDE.md` and the Cursor rule both point at it.

## Usage

### Branches

- Use *develop* for active development.
- Merge into *test* for staging.
- Merge into *main* for production.

### Run locally

`pnpm run dev`: http://localhost:5555

Use with dev proxy: `https://dev.arise.so/?url=https://project.webflow.io`

### Build

`pnpm run build`

Each `js/<name>.js` is minified to its own `dist/<name>.js`. `dist/` is gitignored — it's build output, rebuild it whenever you need it.

`debugger` statements are stripped; `console` calls are kept on purpose, since logging is how you debug code that only ever runs inside Webflow. Change `esbuild.drop` in [vite.config.js](vite.config.js) if you'd rather strip them.

## Use in Webflow

### Option A — inline (default)

Paste the built `dist/<name>.js` straight into a Webflow embed. The embed element gets the class `u-embed-js`. `dev-src` names the source file so the dev proxy can swap in your localhost version while you work:

```html
<script type="module" dev-src="main.js">
  console.log(`start here`);
</script>
```

Rebuild and re-paste when the source changes. Nothing is hosted, so there's no deploy step and no cache to wait on.

### Option B — hosted (optional)

For projects where re-pasting is impractical, host `dist/` on Netlify and point the embed at URLs instead. Same `u-embed-js` class, three attributes for production, test and dev:

```html
<script
  type="module"
  src="https://project.netlify.app/main.js"
  test-src="https://test--project.netlify.app/main.js"
  dev-src="http://localhost:5555/js/main.js"
></script>
```

Netlify publishes `dist` as the site root, so built files are served from `/`, not `/dist/`. In dev, vite serves the unbuilt source from `/js/`.

To enable this path:

```
pnpm run setup:netlify
```

That fills the `project.netlify.app` placeholders with your repo name and enables the GitHub Action that builds every PR into `test`/`main`, so a syntax error can't reach a live site. Pass a different site name with `pnpm run setup:netlify -- my-site`.

[netlify.toml](netlify.toml) holds the build command and cache headers. It's inert unless you actually connect the repo to Netlify.

Use with test proxy: `https://test.arise.so/?test=netlify-url.com&url=https://project.webflow.io`
