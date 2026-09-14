import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");

export default defineConfig({
    plugins: [tailwindcss(), tanstackStart(), react(), nitro()],
    server: {
        port: 80,
    },
    define: {
        __APP_VERSION__: JSON.stringify(env.npm_package_version),
        __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    },
    resolve: {
        alias: {
            "@": path.resolve(import.meta.dirname, "./src"),
        },
        tsconfigPaths: true,
    },
});
