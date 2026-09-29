import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          firebase: ["firebase/app", "firebase/firestore", "firebase/app-check"],
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
        },
      },
    },
  },
  server: {
    port: 12001,
    // Reachable through the sandbox's HTTPS proxy, which rewrites the Host header.
    allowedHosts: [".prod-runtime.all-hands.dev"],
    proxy: {
      "/api": "http://localhost:12000",
    },
  },
  preview: {
    port: 12001,
    allowedHosts: [".prod-runtime.all-hands.dev"],
  },
});
