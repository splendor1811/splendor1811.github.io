import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// For GitHub Pages project sites the app is served from /<repo>/.
// Override at build time with BASE_PATH (e.g. "/Second_Brain/").
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Content changes frequently; stable libraries should keep their cached files.
        // Match only these packages, so route-only graph/Markdown code stays lazy.
        onlyExplicitManualChunks: true,
        manualChunks(id) {
          const modulePath = id.replaceAll("\\", "/");
          if (modulePath.endsWith("/src/data/content.json")) {
            return "research-content";
          }
          if (/\/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(modulePath)) {
            return "vendor-react";
          }
          if (/\/node_modules\/(dexie|dexie-react-hooks|minisearch)\//.test(modulePath)) {
            return "vendor-data";
          }
        },
      },
    },
  },
  server: {
    port: 5273,
    // Proxy the optional local writeback server so `bun run serve` powers Markdown edits in dev.
    proxy: {
      "/api": {
        target: "http://localhost:5274",
        changeOrigin: true,
      },
    },
  },
});
