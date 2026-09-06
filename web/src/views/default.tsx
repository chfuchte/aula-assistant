import { GridButton } from "@/components/grid-button";
import { View } from "@/components/view";
import { useRouter } from "@/hooks/router";
import { LifeBuoy, Rocket } from "lucide-react";

export function DefaultView() {
    const router = useRouter();

    return (
        <View className="grid-cols-2 grid-rows-1">
            <GridButton onClick={() => router.push("root:default")}>
                <GridButton.Icon>
                    <LifeBuoy />
                </GridButton.Icon>
                <GridButton.Label>Geführter Modus</GridButton.Label>
                <GridButton.Description>Schritt-für-Schritt durch die ersten Veranstaltungen</GridButton.Description>
            </GridButton>

            <GridButton onClick={() => router.push("unmanaged:default")}>
                <GridButton.Icon>
                    <Rocket />
                </GridButton.Icon>
                <GridButton.Label>Ungeführter Modus</GridButton.Label>
                <GridButton.Description>Für erfahrene Nutzer:innen und Techniker:innen</GridButton.Description>
            </GridButton>
        </View>
    );
}
