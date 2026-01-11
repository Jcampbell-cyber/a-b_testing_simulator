import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // ✅ relative paths for Vercel/Netlify
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    historyApiFallback: true, // ✅ ensures deep links like /nhst work locally
  },
  build: {
    rollupOptions: {
      // externalize nothing to avoid missing modules on Vercel
      external: [],
    },
  },
});
