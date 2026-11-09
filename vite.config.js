// vite.config.js
import { defineConfig } from "vite";
import { readdirSync } from "fs";
import { join } from "path";

// Every .js file in js/ becomes its own entry, so each feature builds to a
// standalone dist/<name>.js you can paste into a Webflow embed.
function getInputFiles(dir) {
  const files = readdirSync(dir);
  const input = {};
  files.forEach((file) => {
    if (file.endsWith(".js")) {
      const name = file.replace(".js", "");
      input[name] = join(dir, file);
    }
  });
  return input;
}

export default defineConfig({
  server: {
    host: "localhost",
    port: 5555,
    // Open CORS so the dev proxy can load these files from the Webflow domain.
    cors: { origin: "*" },
    hmr: {
      host: "localhost",
      protocol: "ws",
    },
  },
  preview: {
    port: 5555,
  },
  build: {
    // Vite 8 minifies with Oxc via Rolldown — `esbuild.drop` is a no-op.
    // Use one `rolldownOptions` object (don't also set `rollupOptions`;
    // that alias is deprecated and a second key can wipe `input`).
    rolldownOptions: {
      input: getInputFiles("./js"),
      output: {
        dir: "dist",
        entryFileNames: "[name].js", // Stable names — Webflow embeds point at these.
        chunkFileNames: "[name].js",
        minify: {
          compress: { dropConsole: true, dropDebugger: true },
        },
      },
    },
  },
});
