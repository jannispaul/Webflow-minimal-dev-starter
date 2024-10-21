// // vite.config.js
// import { defineConfig } from "vite";
// import { readdirSync } from "fs";
// import { join } from "path";

// function getInputFiles(dir) {
//   const files = readdirSync(dir);
//   const input = {};
//   files.forEach((file) => {
//     if (file.endsWith(".js")) {
//       const name = file.replace(".js", "");
//       input[name] = join(dir, file);
//     }
//   });
//   return input;
// }

// export default defineConfig({
//   server: {
//     host: "localhost",
//     port: 5555,
//     cors: "*",
//     hmr: {
//       host: "localhost",
//       protocol: "ws",
//     },
//   },
//   preview: {
//     port: 5555,
//   },
//   esbuild: {
//     drop: ["console", "debugger"],
//   },
//   build: {
//     rollupOptions: {
//       input: getInputFiles("./js"),
//       output: {
//         dir: "dist", // Output directory
//         entryFileNames: "[name].js", // Hashed file names
//         chunkFileNames: "[name].js", // Hashed chunk names
//       },
//     },
//   },
// });

import { defineConfig } from "vite";
import { readdirSync } from "fs";
import { join } from "path";

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
    cors: "*",
    hmr: {
      host: "localhost",
      protocol: "ws",
    },
  },
  preview: {
    port: 5555,
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
  build: {
    rollupOptions: {
      input: "js/main.js", //getInputFiles("./js"),
      output: {
        dir: "dist",
        entryFileNames: "[name].js",
        format: "es",
        // Disable code splitting
        manualChunks: undefined,
        // Ensure all dependencies are bundled
        inlineDynamicImports: true,
      },
    },
    // Disable splitting vendor chunks
    splitVendorChunkSources: false,
    // Ensure CommonJS dependencies are bundled
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});
