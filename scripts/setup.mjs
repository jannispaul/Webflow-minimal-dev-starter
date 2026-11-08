// Replaces the PROJECT_NAME placeholders with this repo's actual name.
//
//   pnpm install  → runs this automatically (MCP + Claude settings)
//
// Safe to re-run; every step no-ops once it has been applied.

import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { basename, resolve } from "path";

const TEMPLATE_NAME = "webflow-minimal-dev-starter";
const PLACEHOLDER = "PROJECT_NAME";
const root = process.cwd();

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

// Point the MCP server and its permission rule at this project.

if (edit(".mcp.json", (s) => s.replaceAll(PLACEHOLDER, name))) {
  changed.push(`.mcp.json → webflow-${name}`);
}

if (edit(".claude/settings.json", (s) => s.replaceAll(PLACEHOLDER, name))) {
  changed.push(`.claude/settings.json → mcp__webflow-${name} allowed`);
}

if (changed.length) {
  console.log(`Set up ${name}:`);
  changed.forEach((line) => console.log(`  ${line}`));
}
