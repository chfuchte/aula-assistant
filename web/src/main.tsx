import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

import "@/styles/global.css";
import { RouterProvider } from "./hooks/router.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider>
            <App />
        </RouterProvider>
    </StrictMode>,
);
