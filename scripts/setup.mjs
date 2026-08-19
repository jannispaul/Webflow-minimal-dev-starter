// Replaces the PROJECT_NAME placeholders with this repo's actual name.
//
//   pnpm install            → runs this automatically (MCP + Claude settings)
//   pnpm run setup:netlify  → additionally wires up the optional Netlify hosting
//
// Safe to re-run; every step no-ops once it has been applied.

import { execSync } from "child_process";
import { existsSync, readFileSync, renameSync, writeFileSync } from "fs";
import { basename, resolve } from "path";

const TEMPLATE_NAME = "webflow-minimal-dev-starter";
const PLACEHOLDER = "PROJECT_NAME";
const root = process.cwd();

const withNetlify = process.argv.includes("--netlify");
// Optional explicit Netlify site name: `pnpm run setup:netlify -- my-site`
const siteNameArg = process.argv.slice(2).find((arg) => !arg.startsWith("-"));

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getProjectName() {
  try {
    const remote = execSync("git remote get-url origin", {
      stdio: ["ignore", "pipe", "ignore"],
    }).toString();
    return slugify(basename(remote.trim()).replace(/\.git$/, ""));
  } catch {
    return slugify(basename(root));
  }
}

function edit(file, transform) {
  const path = resolve(root, file);
  if (!existsSync(path)) return false;
  const before = readFileSync(path, "utf8");
  const after = transform(before);
  if (after === before) return false;
  writeFileSync(path, after);
  return true;
}

const name = getProjectName();

if (!name || name === TEMPLATE_NAME) {
  // Still the template repo itself — leave the placeholders for the next clone.
  process.exit(0);
}

const changed = [];

// --- Always: point the MCP server and its permission rule at this project ---

if (edit(".mcp.json", (s) => s.replaceAll(PLACEHOLDER, name))) {
  changed.push(`.mcp.json → webflow-${name}`);
}

if (edit(".claude/settings.json", (s) => s.replaceAll(PLACEHOLDER, name))) {
  changed.push(`.claude/settings.json → mcp__webflow-${name} allowed`);
}

// --- Opt-in: the Netlify hosting path (most projects paste code inline) ---

if (withNetlify) {
  const site = siteNameArg ? slugify(siteNameArg) : name;

  if (edit("readme.md", (s) => s.replaceAll("project.netlify.app", `${site}.netlify.app`))) {
    changed.push(`readme.md → ${site}.netlify.app`);
  }

  if (edit("AGENTS.md", (s) => s.replaceAll("project.netlify.app", `${site}.netlify.app`))) {
    changed.push(`AGENTS.md → ${site}.netlify.app`);
  }

  const workflow = resolve(root, ".github/workflows/netlify-build.yml");
  const disabled = `${workflow}.example`;
  if (existsSync(disabled) && !existsSync(workflow)) {
    renameSync(disabled, workflow);
    changed.push("enabled .github/workflows/netlify-build.yml");
  }
}

if (changed.length) {
  console.log(`Set up ${name}:`);
  changed.forEach((line) => console.log(`  ${line}`));
}
