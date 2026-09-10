import { ThemeProvider } from "@/components/theme-provider";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";

import css from "@/styles/global.css?url";

export const Route = createRootRoute({
    head: () => ({
        links: [
            {
                rel: "stylesheet",
                href: css,
            },
            {
                rel: "icon",
                type: "image/x-icon",
                href: "/favicon.ico",
            },
        ],
        meta: [
            {
                charSet: "utf-8",
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            {
                title: "ATec Aula Assistant",
            },
            {
                name: "description",
                content:
                    "Aula Assistant is a user-friendly media control system in the Gymnasium Riedberg auditorium. It lets both trained staff and non-technical users operate the projector, sound system, and lighting, while also offering advanced controls for technical staff.",
            },
        ],
    }),
    component: Root,
});

function Root() {
    return (
        <html lang="de">
            <head>
                <HeadContent />
            </head>
            <body>
                <ThemeProvider defaultTheme="system" storageKey="aula-assistant-ui-theme">
                    <Outlet />
                </ThemeProvider>

                <Scripts />
            </body>
        </html>
    );
}
