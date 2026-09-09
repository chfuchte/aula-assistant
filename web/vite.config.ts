import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path, { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            injectRegister: "auto",
            registerType: "autoUpdate",
            manifest: {
                name: "Aula Assistant",
                short_name: "Aula Assistant",
                description: "",
                start_url: "/",
                display: "standalone",
                lang: "de",
                orientation: "portrait",
                dir: "ltr",
                background_color: "#0a0a0a",
                theme_color: "#0a0a0a",
                icons: [
                    {
                        src: "/web-app-manifest-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "maskable",
                    },
                    {
                        src: "/web-app-manifest-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
            },
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
            },
        }),
    ],
    define: {
        __APP_VERSION__: JSON.stringify(env.npm_package_version),
        __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    },
    build: {
        rollupOptions: {
            input: {
                index: resolve(import.meta.dirname, "index.html"),
                tablet: resolve(import.meta.dirname, "tablet.html"),
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(import.meta.dirname, "./src"),
        },
    },
});
