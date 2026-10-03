import { createRootRoute, HeadContent, Outlet, Scripts, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

import css from "@/styles/global.css?url";

const CLICK_SUPPRESSION_MS = 500;

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
    const router = useRouter();

    useEffect(() => {
        let timeoutId: number | undefined;
        let active = false;

        const suppressClick = (event: Event) => {
            if (!active) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
        };

        const stopSuppression = () => {
            active = false;
            document.body.style.pointerEvents = "";
            document.removeEventListener("click", suppressClick, true);
            document.removeEventListener("pointerdown", suppressClick, true);
            document.removeEventListener("pointerup", suppressClick, true);
            document.removeEventListener("touchstart", suppressClick, true);
            document.removeEventListener("touchend", suppressClick, true);

            if (timeoutId !== undefined) {
                window.clearTimeout(timeoutId);
                timeoutId = undefined;
            }
        };

        const startSuppression = () => {
            active = true;
            document.body.style.pointerEvents = "none";
            document.addEventListener("click", suppressClick, true);
            document.addEventListener("pointerdown", suppressClick, true);
            document.addEventListener("pointerup", suppressClick, true);
            document.addEventListener("touchstart", suppressClick, true);
            document.addEventListener("touchend", suppressClick, true);

            if (timeoutId !== undefined) {
                window.clearTimeout(timeoutId);
            }

            timeoutId = window.setTimeout(stopSuppression, CLICK_SUPPRESSION_MS);
        };

        const unsubscribe = router.subscribe("onBeforeLoad", () => {
            startSuppression();
        });

        return () => {
            unsubscribe();
            stopSuppression();
        };
    }, [router]);

    return (
        <html lang="de" suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>
            <body>
                <Outlet />

                <Scripts />
            </body>
        </html>
    );
}
