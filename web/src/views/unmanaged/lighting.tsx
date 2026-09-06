import { GridButton } from "@/components/grid-button";
import { View } from "@/components/view";

export function UnmanagedLightingView() {
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
        <View className="grid-cols-3 grid-rows-3">
            {scenes.map((scene, key) => (
                <GridButton key={key} onClick={() => {}}>
                    <GridButton.Label>{scene.name}</GridButton.Label>
                    <GridButton.Description>{scene.description}</GridButton.Description>
                </GridButton>
            ))}
        </View>
    );
}
