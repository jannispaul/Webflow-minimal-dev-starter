// Renames the .mcp.json placeholder server to match this project.
// Runs automatically on `pnpm install` (postinstall). Safe to re-run.

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { basename, resolve } from "path";

const TEMPLATE_NAME = "webflow-minimal-dev-starter";
const PLACEHOLDER = "webflow-PROJECT_NAME";
const CONFIG = resolve(process.cwd(), ".mcp.json");

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
    return slugify(basename(process.cwd()));
  }
}

const name = getProjectName();

if (!name || name === TEMPLATE_NAME) {
  // Still the template itself — leave the placeholder in place.
  process.exit(0);
}

let config;
try {
  config = JSON.parse(readFileSync(CONFIG, "utf8"));
} catch {
  process.exit(0);
}

const servers = config.mcpServers ?? {};
if (!servers[PLACEHOLDER]) {
  // Already renamed.
  process.exit(0);
}

const renamed = `webflow-${name}`;
config.mcpServers = Object.fromEntries(
  Object.entries(servers).map(([key, value]) => [key === PLACEHOLDER ? renamed : key, value])
);

writeFileSync(CONFIG, `${JSON.stringify(config, null, 2)}\n`);
console.log(`Set up .mcp.json → ${renamed}`);
