import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@bklitui/ui/charts": fileURLToPath(new URL("./src/components/ui/charts.tsx", import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 3000,
    open: false,
  },
});