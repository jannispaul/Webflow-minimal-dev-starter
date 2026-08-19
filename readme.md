# Minimal Webflow Developement Starter

Repository template that uses [vite](https://vitejs.dev/) to run dev server and to minify output.

## Setup

Use with setup script `new-webflow-project project-name`
```
gh repo create "$PROJECT_NAME" \
  --template jannispaul/Webflow-minimal-dev-starter \
  --private \
  --include-all-branches \
  --clone
```

Then install once — `postinstall` rewrites the `.mcp.json` placeholder to `webflow-<repo-name>`:

```
pnpm install
```

## Conventions

[AGENTS.md](AGENTS.md) is the single source of truth for coding conventions (Lumos, variables, embeds). `CLAUDE.md` and the Cursor rule both point at it.

## Usage

### Branches

- Use *dev* for active development.
- Merge into *test* for staging.
- Merge into *main* for production.  


### Run locally

`pnpm run dev`: http://localhost:5555

Use with dev proxy: `https://dev.arise.so/?url=https://project.webflow.io`

Use with test proxy: `https://test.arise.so/ ? test=netlify-url.com & url=https://project.webflow.io`


### Minify and deploy to netlify

`pnpm run build`

### Use in webflow

Add the script in an embed with the class `u-embed-js`, using 3 attributes for production, test, and dev environments.

Netlify publishes `dist` as the site root, so built files are served from `/`, not `/dist/`. In dev, vite serves the unbuilt source from `/js/`.

```
<script
  type="module"
  src="https://project.netlify.app/main.js"
  test-src="https://test--project.netlify.app/main.js"
  dev-src="http://localhost:5555/js/main.js"
></script>
```
