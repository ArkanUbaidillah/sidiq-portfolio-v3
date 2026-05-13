// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/sidiq/", // Gunakan path absolut untuk subfolder agar routing lancar
});
