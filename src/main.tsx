import React from "react";
import ReactDOM from "react-dom/client";
import { WindowProvider } from "@/contexts/window";
import { StartupDataProvider } from "@/contexts/startup-data";
import { App } from "@/App";

document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <StartupDataProvider>
            <WindowProvider>
                <App />
            </WindowProvider>
        </StartupDataProvider>
    </React.StrictMode>,
);
