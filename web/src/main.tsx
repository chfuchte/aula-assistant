import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/App.tsx";
import { RouterProvider } from "@/hooks/router.tsx";

import "@/styles/global.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider>
            <App />
        </RouterProvider>
    </StrictMode>,
);
