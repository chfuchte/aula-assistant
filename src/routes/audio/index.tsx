import { GridButton } from "@/components/grid-button";
import { Page } from "@/components/router/page";
import { View } from "@/components/router/view";
import { loadDefaultAudioScene } from "@/lib/functions/audio.functions";
import { createFileRoute, Link } from "@tanstack/react-router";
import { RotateCcw, SlidersVertical } from "lucide-react";

export const Route = createFileRoute("/audio/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <Page title="Audio" withBefore help withSettings>
            <View className="grid-cols-2 grid-rows-1">
                <GridButton asChild>
                    <Link to="/audio/channel">
                        <GridButton.Icon>
                            <SlidersVertical />
                        </GridButton.Icon>
                        <GridButton.Label>Audio-Känale steuern</GridButton.Label>
                        <GridButton.Description>Kanäle stummschalten und Lautstärken anpassen</GridButton.Description>
                    </Link>
                </GridButton>

                <GridButton onClick={() => void loadDefaultAudioScene()}>
                    <GridButton.Icon>
                        <RotateCcw />
                    </GridButton.Icon>
                    <GridButton.Label>Mischpult vorbereiten</GridButton.Label>
                    <GridButton.Description>Standard-Szene laden</GridButton.Description>
                </GridButton>
            </View>
        </Page>
    );
}
