import { ErrorComponent } from "@/components/router/error";
import { NotFoundComponent } from "@/components/router/not-found";
import { ThemeProvider } from "@/components/theme-provider";
import { routeTree } from "@/routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/styles/global.css";

const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    defaultErrorComponent: ErrorComponent,
    defaultNotFoundComponent: NotFoundComponent,
    isServer: false,
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            throwOnError: false,
        },
        mutations: {
            retry: false,
            throwOnError: false,
        },
    },
});

function AppWithProviders() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="system" storageKey="aula-assistant-ui-theme">
                <RouterProvider router={router} />
            </ThemeProvider>
        </QueryClientProvider>
    );
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppWithProviders />
    </StrictMode>,
);
