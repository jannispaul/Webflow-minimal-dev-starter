# Upgrading an existing project to the current template

For repos created from [Webflow-minimal-dev-starter](https://github.com/jannispaul/Webflow-minimal-dev-starter) before the template was reworked. These are live client projects, so nothing here is a blind copy — work top to bottom and stop at anything marked ⚠️.

**To run this with an agent**, from the existing repo:

> Read https://raw.githubusercontent.com/jannispaul/Webflow-minimal-dev-starter/develop/docs/UPGRADING.md and apply it to this repo. Work through the steps in order, do the checks marked ⚠️ before making the matching change, and tell me what you skipped and why. Do not touch anything in `js/` other than what the steps say.

Template files to copy from can be fetched at `https://raw.githubusercontent.com/jannispaul/Webflow-minimal-dev-starter/develop/<path>`.

Steps 1–3 are safe and additive. Steps 4–6 can break a live site — read the warnings.

---

## What changed in the template

- **Inline embeds are the only path.** Build locally, paste `dist/<name>.js` into a Webflow embed. Netlify hosting (`netlify.toml`, the build GitHub Action) is gone from the template.
- **Two branches: `develop` → `main`.** The `test` staging branch is gone.
- `AGENTS.md` is the single source of truth for conventions; `CLAUDE.md` and the Cursor rule point at it.
- `.mcp.json` (Webflow MCP) + `.claude/settings.json` (pre-allows it).
- `dist/` is no longer tracked in git.
- Vite 4 → 8, `vite-plugin-minify` dropped.
- `console` and `debugger` are stripped from the build via Oxc minify (`dropConsole` / `dropDebugger`).

---

## 1. Convention files

Copy in `AGENTS.md` and `CLAUDE.md` (which is just `@AGENTS.md`).

Then replace the body of `.cursor/rules/webflow-dev.mdc` with a pointer to `AGENTS.md`, so there's one source of truth:

```
See [AGENTS.md](mdc:AGENTS.md) — it is the single source of truth for this project's conventions.
```

⚠️ If this repo added project-specific rules to the `.mdc` (a component convention, a client quirk), move them into `AGENTS.md` first — don't delete them.

If the project already has its own `AGENTS.md` or `CLAUDE.md`, merge rather than overwrite; project-specific rules win over template defaults.

## 2. Webflow MCP

Add `.mcp.json` and `.claude/settings.json`, using the real project name — no placeholder, since this repo already has a name:

```json
// .mcp.json
{
  "mcpServers": {
    "webflow-my-project": {
      "type": "http",
      "url": "https://mcp.webflow.com/mcp"
    }
  }
}
```

```json
// .claude/settings.json
{
  "enableAllProjectMcpServers": true,
  "permissions": {
    "allow": ["mcp__webflow-my-project"]
  }
}
```

The name in `allow` must match the key in `.mcp.json` exactly, or the permission rule silently does nothing. Add `.claude/settings.local.json` to `.gitignore`.

The server still needs OAuth — run `/mcp` in an interactive Claude Code session once per machine.

Copying `scripts/setup.mjs` and the `setup` / `postinstall` scripts is optional here. It exists to fill placeholders on a fresh clone, which this repo is past. Take it if you want future template updates to apply uniformly.

## 3. Does this project use Netlify?

Decide now — it changes steps 4 and 6.

Check for a connected Netlify site, and grep the Webflow embeds for a `src="https://....netlify.app/"`.

- **No** (most projects) → delete `netlify.toml`, any `.github/workflows/netlify-build.yml(.example)` and a `setup:netlify` script in `package.json`.
- **Yes** → the template no longer supports this, but don't rip it out of a live project blindly. Either move the embeds to inline first and then delete the Netlify files, or keep the project's own `netlify.toml` — step 6 has a change you cannot skip.

## 4. Stop tracking `dist/`

```bash
git rm -r --cached dist
```

Then add to `.gitignore`:

```
# build output
dist/
```

⚠️ **Check the Webflow embeds first.** If any script loads `dist/` from GitHub directly — `raw.githubusercontent.com`, `cdn.jsdelivr.net/gh/...`, or similar — untracking it takes the live site down. Move those embeds to inline *before* this step.

Netlify-hosted projects are unaffected; Netlify builds `dist/` from source.

## 5. ⚠️ Vite 4 → 8

The riskiest step. It changes the built output that's currently running on a live site.

```bash
pnpm remove vite-plugin-minify
pnpm add -D vite@latest
```

Needs Node 22+. Then apply these, all of which are required:

**`package.json`** — add `"type": "module"`. Without it Vite 8 warns on every build.

⚠️ If `vite.config.js` uses `require()` or `module.exports`, `"type": "module"` breaks it. Convert to `import` / `export default` first.

**`vite.config.js`** — `cors: "*"` is invalid from Vite 5 on. The dev proxy stops working if you leave it:

```js
cors: { origin: "*" },
```

**`vite.config.js`** — Vite 8 minifies with Oxc via Rolldown, so `esbuild.drop` is a no-op for console. Put minify on the same `rolldownOptions` object as `input` (don't set both `rollupOptions` and `rolldownOptions` — the second wins and can wipe `input`):

```js
build: {
  rolldownOptions: {
    input: getInputFiles("./js"),
    output: {
      dir: "dist",
      entryFileNames: "[name].js",
      chunkFileNames: "[name].js",
      minify: {
        compress: { dropConsole: true, dropDebugger: true },
      },
    },
  },
},
```

Key is `dropConsole` (camelCase), not `drop_console`. Verify with `pnpm run build && rg 'console\.' dist/` — should find nothing.

**Then diff before you ship:**

```bash
pnpm run build
```

Compare the new `dist/<name>.js` against what's currently live in the Webflow embed. A major Vite jump can change output. Re-paste inline embeds, or deploy, only once you've looked at it — and check the site afterwards.

## 6. `netlify.toml`

**If the project still uses Netlify** — this one is mandatory alongside step 5. Vite 8 needs Node 22, and the file currently pins 20, so the next deploy fails:

```toml
[build]
command = "pnpm run build"
publish = "dist"

[build.environment]
NODE_VERSION = "22"
```

Also worth changing: cache headers from `max-age=3600` to `max-age=60, must-revalidate`. Filenames are stable, so an hour-long TTL means a deploy can leave stale code running for an hour.

**If it doesn't use Netlify**, delete the file (step 3).

## 7. Webflow Designer

Not in the repo, but part of the convention:

- Custom JS embeds get the class `u-embed-js`.
- Custom CSS embeds get the class `u-embed-css`, with a one-line comment saying what the CSS does.
- Inline embeds use `<script type="module" dev-src="main.js">` so the dev proxy can swap in localhost.

## 8. Verify, then propagate

```bash
rm -rf node_modules dist
pnpm install
pnpm run build
```

Expect: no warnings, and a non-empty `dist/`. Then run the dev server and load the site through the dev proxy to confirm CORS still works:

```bash
pnpm run dev
```

Once the live site is confirmed good, merge along the project's own branch flow (`develop` → `main`). If the project has a `test` branch that nothing deploys from anymore, delete it.

---

## If something breaks

Nothing here touches `js/` source, so a revert is clean:

```bash
git revert <commit>
pnpm install
pnpm run build
```

The exception is step 4 — if you untracked `dist/` and an embed was loading it from GitHub, reverting restores the files, but any CDN that cached the 404 may need a purge.
