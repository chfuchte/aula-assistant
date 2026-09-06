import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UnmanagedBeamerView } from "./views/unmanaged/beamer";

import "@/styles/global.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <main className="min-h-dvh w-full *:gap-8! *:p-8!">
            <UnmanagedBeamerView />
        </main>
    </StrictMode>,
);
