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
