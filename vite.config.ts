import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  // Absolute asset paths, so deep links like /resources/calculators/... load correctly.
  base: "/",
  ssr: {
    // CommonJS package without proper named exports in Node; bundle it into the pre-render build
    noExternal: ["react-helmet-async"],
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks that rarely change between deploys.
        // (Not for the build-time pre-render bundle, where these packages stay external.)
        manualChunks: isSsrBuild
          ? undefined
          : { react: ["react", "react-dom", "react-router-dom", "react-helmet-async"] },
      },
    },
  },
}));
