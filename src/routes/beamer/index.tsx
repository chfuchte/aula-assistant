import { GridButton } from "@/components/grid-button";
import { Page } from "@/components/page";
import { View } from "@/components/view";
import { turnBeamerOff, turnBeamerOn } from "@/lib/functions/beamer.functions";
import { tryCatch } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Power, PowerOff } from "lucide-react";

export const Route = createFileRoute("/beamer/")({
    component: RouteComponent,
    head: () => ({
        meta: [
            {
                title: "ATec Aula Assistant // Beamer",
            },
        ],
    }),
});

function RouteComponent() {
    const turnOn = useServerFn(turnBeamerOn);
    const turnOff = useServerFn(turnBeamerOff);

    return (
        <Page title="Beamer" withBefore help={"/help/beamer"} withSettings>
            <View className="grid-cols-2 grid-rows-1">
                <GridButton
                    onClick={async () => {
                        const [, error] = await tryCatch(turnOn());
                        if (error) {
                            alert(`Fehler beim Einschalten des Beamers: ${error.message}`);
                        }
                    }}>
                    <GridButton.Icon>
                        <Power />
                    </GridButton.Icon>
                    <GridButton.Label>Einschalten</GridButton.Label>
                    <GridButton.Description>Beamer einschalten</GridButton.Description>
                </GridButton>

                <GridButton
                    onClick={async () => {
                        const [, error] = await tryCatch(turnOff());
                        if (error) {
                            alert(`Fehler beim Einschalten des Beamers: ${error.message}`);
                        }
                    }}>
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
