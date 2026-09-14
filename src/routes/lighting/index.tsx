import { GridButton } from "@/components/grid-button";
import { Page } from "@/components/page";
import { View } from "@/components/view";
import { getLightingScenes, triggerLightingScene } from "@/lib/functions/lighting.functions";
import { tryCatch } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/lighting/")({
    loader: () => getLightingScenes(),
    component: RouteComponent,
});

function RouteComponent() {
    const scenes = Route.useLoaderData();
    const triggerScene = useServerFn(triggerLightingScene);

    return (
        <Page title="Licht" withBefore help withSettings>
            <View className="grid-cols-4 grid-rows-3">
                {scenes.map((scene) => (
                    <GridButton
                        key={scene.name}
                        onClick={async () => {
                            const [, error] = await tryCatch(triggerScene({ data: { sceneName: scene.name } }));
                            if (error) {
                                alert(`Fehler beim Auslösen der Szene "${scene.name}": ${error.message}`);
                            }
                        }}>
                        <GridButton.Label>{scene.name}</GridButton.Label>
                    </GridButton>
                ))}
            </View>
        </Page>
    );
}
