import { Page } from "@/components/router/page";
import { View } from "@/components/router/view";
import { useTheme } from "@/components/theme-provider";

import LogoDarkMode from "@/assets/logo_transparent_dark.png";
import LogoLightMode from "@/assets/logo_transparent_light.png";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function NotFoundComponent() {
    const { theme } = useTheme();

    return (
        <Page fullscreen>
            <View className="@container relative h-dvh w-full bg-background select-none">
                <span className="sr-only">404 &en; Seite nicht gefunden</span>

                <img
                    src={theme === "dark" ? LogoDarkMode : LogoLightMode}
                    className="absolute inset-0 top-0 left-0 m-auto aspect-square h-1/2 max-h-[50cqh] w-auto max-w-[50cqw] object-contain"
                />

                <Button className="absolute bottom-1/4 left-1/2 -translate-x-1/2" asChild>
                    <Link to="/">Zurück zur Startseite</Link>
                </Button>
            </View>
        </Page>
    );
}
