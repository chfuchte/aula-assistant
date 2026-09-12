import { GridButton } from "@/components/grid-button";
import { Page } from "@/components/router/page";
import { View } from "@/components/router/view";
import { getLightingScenes, triggerLightingScene } from "@/lib/functions/lighting.functions";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/lighting")({
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
                    <GridButton key={scene.name} onClick={() => void triggerScene({ data: { sceneName: scene.name } })}>
                        <GridButton.Label>{scene.name}</GridButton.Label>
                    </GridButton>
                ))}
            </View>
        </Page>
    );
}
