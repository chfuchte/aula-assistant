import { Page } from "@/components/page";
import { View } from "@/components/view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/")({
    component: RouteComponent,
    head: () => ({
        meta: [
            {
                title: "ATec Aula Assistant // Einstellungen",
            },
        ],
    }),
});

function RouteComponent() {
    return (
        <Page title="Einstellungen" withBefore help={false} withSettings={false}>
            <View className="flex h-full flex-col items-center justify-between pt-4">
                <div className="mx-auto grid h-fit w-full max-w-[42em] grid-cols-2 grid-rows-1 gap-4" />

                <div className="mx-auto flex h-fit w-full max-w-[42em] flex-col items-center gap-1 text-sm text-muted-foreground">
                    <span>
                        v{__APP_VERSION__} ({__BUILD_DATE__})
                    </span>
                    <span>&copy; 2026 Christian Fuchte</span>
                </div>
            </View>
        </Page>
    );
}
