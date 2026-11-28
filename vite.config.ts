import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/my-portfolio/",
  plugins: [react(), tailwindcss()],
  // Ship only minified code: no source maps, comments or console calls.
  build: {
    sourcemap: false,
  },
  esbuild: {
    drop: ["console", "debugger"],
    legalComments: "none",
  },
});
