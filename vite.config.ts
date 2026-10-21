import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// A relative base works on GitHub project pages and on a custom domain.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
