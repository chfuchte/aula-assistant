import { GridButton } from "@/components/grid-button";
import { Page } from "@/components/router/page";
import { View } from "@/components/router/view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/lighting")({
    component: RouteComponent,
});

function RouteComponent() {
    const scenes = [
        {
            name: "Strom An",
            description: "Lichtanlage einschalten",
        },
        {
            name: "Strom Aus",
            description: "Lichtanlage ausschalten",
        },
        {
            name: "Reset",
            description: "Alle Szenen zurücksetzen; Bühne dunkel",
        },
        {
            name: "Frontlicht",
            description: "Licht von vorne",
        },
        {
            name: "Frontlicht Dimmed",
            description: "Gedimmtes Licht von vorne",
        },
        {
            name: "Frontlicht Off",
            description: "Kein Frontlicht",
        },
        {
            name: "Bühne Warmweiß",
            description: "Warmweißes Bühnenlicht",
        },
        {
            name: "Bühne Kaltweiß",
            description: "Kaltweißes Bühnenlicht",
        },
        {
            name: "Disko",
            description: "Buntes Diskolicht",
        },
    ];

    return (
        <Page title="Licht" withBefore help withSettings>
            <View className="grid-cols-3 grid-rows-3">
                {scenes.map((scene, key) => (
                    <GridButton key={key} onClick={() => {}}>
                        <GridButton.Label>{scene.name}</GridButton.Label>
                        <GridButton.Description>{scene.description}</GridButton.Description>
                    </GridButton>
                ))}
            </View>
        </Page>
    );
}
