import { GridButton } from "@/components/grid-button";
import { Page } from "@/components/router/page";
import { View } from "@/components/router/view";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { LifeBuoy, Rocket } from "lucide-react";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    const router = useRouter();

    return (
        <Page title="Bitte wähle einen Modus">
            <View className="grid-cols-2 grid-rows-1">
                <GridButton disabled onClick={() => {}}>
                    <GridButton.Icon>
                        <LifeBuoy />
                    </GridButton.Icon>
                    <GridButton.Label>Geführter Modus</GridButton.Label>
                    <GridButton.Description>
                        {/* Schritt-für-Schritt durch die ersten Veranstaltungen */} Comming soon
                    </GridButton.Description>
                </GridButton>

                <GridButton onClick={() => router.navigate({ to: "/unassisted" })}>
                    <GridButton.Icon>
                        <Rocket />
                    </GridButton.Icon>
                    <GridButton.Label>Ungeführter Modus</GridButton.Label>
                    <GridButton.Description>Für erfahrene Nutzer:innen und Techniker:innen</GridButton.Description>
                </GridButton>
            </View>
        </Page>
    );
}
