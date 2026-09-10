import { GridButton } from "@/components/grid-button";
import { Page } from "@/components/router/page";
import { View } from "@/components/router/view";
import { createFileRoute } from "@tanstack/react-router";
import { Power, PowerOff } from "lucide-react";

export const Route = createFileRoute("/beamer")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <Page title="Beamer" withBefore help withSettings>
            <View className="grid-cols-2 grid-rows-1">
                <GridButton onClick={() => {}}>
                    <GridButton.Icon>
                        <Power />
                    </GridButton.Icon>
                    <GridButton.Label>Einschalten</GridButton.Label>
                    <GridButton.Description>Beamer einschalten</GridButton.Description>
                </GridButton>

                <GridButton onClick={() => {}}>
                    <GridButton.Icon>
                        <PowerOff />
                    </GridButton.Icon>
                    <GridButton.Label>Ausschalten</GridButton.Label>
                    <GridButton.Description>Beamer ausschalten</GridButton.Description>
                </GridButton>
            </View>
        </Page>
    );
}
