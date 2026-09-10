import { GridButton } from "@/components/grid-button";
import { Page } from "@/components/router/page";
import { View } from "@/components/router/view";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Lightbulb, Lock, Music, Projector } from "lucide-react";

export const Route = createFileRoute("/unassisted/")({
    component: RouteComponent,
});

function RouteComponent() {
    const router = useRouter();

    return (
        <Page title="Ungeführter Modus" withBefore help withSettings>
            <View className="grid-cols-2 grid-rows-2">
                <GridButton onClick={() => router.navigate({ to: "/unassisted/audio" })}>
                    <GridButton.Icon>
                        <Music />
                    </GridButton.Icon>
                    <GridButton.Label>Ton</GridButton.Label>
                    <GridButton.Description>lorem ipsum</GridButton.Description>
                </GridButton>

                <GridButton onClick={() => router.navigate({ to: "/unassisted/beamer" })}>
                    <GridButton.Icon>
                        <Projector />
                    </GridButton.Icon>
                    <GridButton.Label>Beamer</GridButton.Label>
                    <GridButton.Description>lorem ipsum</GridButton.Description>
                </GridButton>

                <GridButton onClick={() => router.navigate({ to: "/unassisted/lighting" })}>
                    <GridButton.Icon>
                        <Lightbulb />
                    </GridButton.Icon>
                    <GridButton.Label>Licht</GridButton.Label>
                    <GridButton.Description>lorem ipsum</GridButton.Description>
                </GridButton>

                <GridButton disabled>
                    <GridButton.Icon>
                        <Lock />
                    </GridButton.Icon>
                    <GridButton.Label>Coming soon</GridButton.Label>
                    <GridButton.Description></GridButton.Description>
                </GridButton>
            </View>
        </Page>
    );
}
