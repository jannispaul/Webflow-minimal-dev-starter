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

### Skills

[Agent Skills](https://agentskills.io) (`SKILL.md` folders) ship with the template. They're a cross-agent open standard — the same folder works in Claude Code, Codex and Cursor; only the discovery path differs per tool. The agent loads a skill automatically when a request matches its description.

The canonical copy lives in the vendor-neutral `.agents/skills/` (read by Codex and Cursor). `.claude/skills/` symlinks to it so Claude Code picks it up too — one source, no drift. (On Windows, `git config core.symlinks true` before cloning, or copy the folder instead of symlinking.)

- **`webflow-lumos-pages`** — compose pages and sections from the existing Lumos component kit (Section, Layout, Grid, Card Primary, …) via the Webflow MCP, using only their props, variants and slots. Triggers on page/section work like "add a hero" or "build a features section".

## Usage

### Branches

- Use *develop* for active development.
- Merge into *main* for production.

### Run locally

`pnpm run dev`: http://localhost:5555

Use with dev proxy: `https://dev.arise.so/?url=https://project.webflow.io`

### Build

`pnpm run build`

Each `js/<name>.js` is minified to its own `dist/<name>.js`. `dist/` is gitignored — it's build output, rebuild it whenever you need it.

`console` and `debugger` are stripped from the build via Oxc minify in [vite.config.js](vite.config.js) (`dropConsole` / `dropDebugger`).

## Use in Webflow

Paste the built `dist/<name>.js` straight into a Webflow embed. The embed element gets the class `u-embed-js`. `dev-src` names the source file so the dev proxy can swap in your localhost version while you work:

```html
<script type="module" dev-src="main.js">
  console.log(`start here`);
</script>
```

Rebuild and re-paste when the source changes. Nothing is hosted, so there's no deploy step and no cache to wait on.
