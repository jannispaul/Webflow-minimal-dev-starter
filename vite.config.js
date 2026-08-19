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
  esbuild: {
    // `console` is deliberately NOT dropped — logs are how you debug code
    // that only ever runs pasted inside Webflow. Add "console" here if you
    // want them stripped from the build.
    drop: ["debugger"],
  },
  build: {
    rollupOptions: {
      input: getInputFiles("./js"),
      output: {
        dir: "dist",
        entryFileNames: "[name].js", // Stable names — Webflow embeds point at these.
        chunkFileNames: "[name].js",
      },
    },
  },
});
