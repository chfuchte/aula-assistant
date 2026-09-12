import { GridButton } from "@/components/grid-button";
import { Page } from "@/components/router/page";
import { View } from "@/components/router/view";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Lightbulb, Lock, Music, Projector } from "lucide-react";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <Page title="Aula Assistant" help withSettings>
            <View className="grid-cols-2 grid-rows-2">
                <GridButton asChild>
                    <Link to="/audio">
                        <GridButton.Icon>
                            <Music />
                        </GridButton.Icon>
                        <GridButton.Label>Ton</GridButton.Label>
                        <GridButton.Description></GridButton.Description>
                    </Link>
                </GridButton>

                <GridButton asChild>
                    <Link to="/beamer">
                        <GridButton.Icon>
                            <Projector />
                        </GridButton.Icon>
                        <GridButton.Label>Beamer</GridButton.Label>
                        <GridButton.Description></GridButton.Description>
                    </Link>
                </GridButton>

                <GridButton asChild>
                    <Link to="/lighting">
                        <GridButton.Icon>
                            <Lightbulb />
                        </GridButton.Icon>
                        <GridButton.Label>Bühnenbeleuchtung</GridButton.Label>
                        <GridButton.Description></GridButton.Description>
                    </Link>
                </GridButton>

                <GridButton disabled>
                    <GridButton.Icon>
                        <Lock />
                    </GridButton.Icon>
                    <GridButton.Label>Bald verfügbar</GridButton.Label>
                    <GridButton.Description></GridButton.Description>
                </GridButton>
            </View>
        </Page>
    );
}
