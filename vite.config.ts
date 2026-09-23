import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Absolute asset paths, so deep links like /resources/calculators/... load correctly.
  base: "/",
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks that rarely change between deploys.
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom", "react-helmet-async"],
        },
      },
    },
  },
});
