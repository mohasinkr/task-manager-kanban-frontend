import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on mode
  const env = loadEnv(mode, process.cwd(), "");

  // Check if mocks should be enabled in this environment
  const enableMocks = env.VITE_ENABLE_MOCKS === "true";

  console.log(
    `Building for ${mode} with mocks ${enableMocks ? "enabled" : "disabled"}`
  );

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        // Ensure the service worker is included in the build if mocks are enabled
        onwarn(warning, warn) {
          // Suppress certain warnings if needed
          if (
            warning.code === "MODULE_LEVEL_DIRECTIVE" &&
            warning.message.includes("use client")
          ) {
            return;
          }
          warn(warning);
        },
      },
    },
    // Copy the service worker to the build output if mocks are enabled in production
    ...(mode === "production" && enableMocks
      ? {
          plugins: [
            react(),
            tailwindcss(),
            {
              name: "copy-msw-worker",
              closeBundle() {
                // Copy the service worker file to the dist directory
                if (fs.existsSync("./public/mockServiceWorker.js")) {
                  fs.copyFileSync(
                    "./public/mockServiceWorker.js",
                    "./dist/mockServiceWorker.js"
                  );
                  console.log("✅ Copied MSW worker to build output");
                } else {
                  console.warn(
                    "⚠️ MSW worker file not found in public directory"
                  );
                }
              },
            },
          ],
        }
      : {}),
  };
});
