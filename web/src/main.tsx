import { App } from "@/App.tsx";
import { RouterProvider } from "@/hooks/router.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./components/theme-provider";
import { DataProvider } from "./hooks/data";

import "@/styles/global.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppWithProviders />
    </StrictMode>,
);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            throwOnError: false,
        },
        mutations: {
            throwOnError: false,
        },
    },
});

function AppWithProviders() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="aula-assistant-ui-theme">
            <QueryClientProvider client={queryClient}>
                <RouterProvider>
                    <DataProvider>
                        <App />
                    </DataProvider>
                </RouterProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
