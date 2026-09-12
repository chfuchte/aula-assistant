import { GridButton } from "@/components/grid-button";
import { Page } from "@/components/router/page";
import { View } from "@/components/router/view";
import { turnBeamerOff, turnBeamerOn } from "@/lib/functions/beamer.functions";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Power, PowerOff } from "lucide-react";

export const Route = createFileRoute("/beamer")({
    component: RouteComponent,
});

function RouteComponent() {
    const turnOn = useServerFn(turnBeamerOn);
    const turnOff = useServerFn(turnBeamerOff);

    return (
        <Page title="Beamer" withBefore help withSettings>
            <View className="grid-cols-2 grid-rows-1">
                <GridButton onClick={() => void turnOn()}>
                    <GridButton.Icon>
                        <Power />
                    </GridButton.Icon>
                    <GridButton.Label>Einschalten</GridButton.Label>
                    <GridButton.Description>Beamer einschalten</GridButton.Description>
                </GridButton>

                <GridButton onClick={() => void turnOff()}>
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
