import { App } from "@/App.tsx";
import { RouterProvider } from "@/hooks/router.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/styles/global.css";
import { ThemeProvider } from "./components/theme-provider";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider>
            <ThemeProvider defaultTheme="system" storageKey="aula-assistant-ui-theme">
                <App />
            </ThemeProvider>
        </RouterProvider>
    </StrictMode>,
);
