import LogoDarkMode from "@/assets/logo_transparent_dark.png";
import { Page } from "@/components/page";
import { Button } from "@/components/ui/button";
import { View } from "@/components/view";
import { Link } from "@tanstack/react-router";

export function NotFoundComponent() {
    return (
        <Page fullscreen>
            <View className="@container relative h-dvh w-full bg-background select-none">
                <img
                    src={LogoDarkMode}
                    className="absolute inset-0 top-0 left-0 m-auto aspect-square h-1/2 max-h-[50cqh] w-auto max-w-[50cqw] object-contain"
                />

                <Button className="absolute bottom-1/4 left-1/2 -translate-x-1/2" asChild>
                    <Link to="/">Zurück zur Startseite</Link>
                </Button>
            </View>
        </Page>
    );
}
