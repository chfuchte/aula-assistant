import { GridButton } from "@/components/grid-button";
import { NetworkErrorVirtualPage } from "@/components/network-error";
import { Page } from "@/components/page";
import { View } from "@/components/view";
import { turnBeamerOff, turnBeamerOn } from "@/lib/functions/beamer.functions";
import { tryCatch } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Power, PowerOff } from "lucide-react";
import { useState } from "react";

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
    const [showNetworkError, setShowNetworkError] = useState<boolean>(false);

    if (showNetworkError) {
        return (
            <Page title="Beamer" withBefore help={"/help/beamer"} withSettings>
                <NetworkErrorVirtualPage
                    onOk={() => {
                        setShowNetworkError(false);
                    }}
                />
            </Page>
        );
    }

    return (
        <Page title="Beamer" withBefore help={"/help/beamer"} withSettings>
            <View className="grid-cols-2 grid-rows-1">
                <GridButton
                    onClick={async () => {
                        const [, error] = await tryCatch(turnOn());
                        if (error) {
                            setShowNetworkError(true);
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
                            setShowNetworkError(true);
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
