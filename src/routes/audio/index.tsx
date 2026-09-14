import { GridButton } from "@/components/grid-button";
import { Page } from "@/components/page";
import { View } from "@/components/view";
import { X32NotReachableVirtualPage } from "@/components/x32-not-reachable";
import { loadDefaultAudioScene } from "@/lib/functions/audio.functions";
import type { AudioChannelState } from "@/lib/server/audio.server";
import { tryCatch } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { RotateCcw, SlidersVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const X32_UNREACHABLE_SUPPRESS_MS = 10_000;

export const Route = createFileRoute("/audio/")({
    component: RouteComponent,
    head: () => ({
        meta: [
            {
                title: "ATec Aula Assistant // Audio",
            },
        ],
    }),
});

function RouteComponent() {
    const [showX32NotReachable, setShowX32NotReachable] = useState<boolean>(false);
    const suppressUntilRef = useRef<number>(0);

    const triggerX32NotReachable = () => {
        if (Date.now() < suppressUntilRef.current) {
            return;
        }
        setShowX32NotReachable(true);
    };

    const dismissX32NotReachable = () => {
        suppressUntilRef.current = Date.now() + X32_UNREACHABLE_SUPPRESS_MS;
        setShowX32NotReachable(false);
    };

    useEffect(() => {
        const eventSource = new EventSource("/api/audio");

        eventSource.onmessage = (event) => {
            const payload = JSON.parse(event.data) as {
                channels?: AudioChannelState[];
                isAlive?: boolean;
            };

            if (typeof payload.isAlive === "boolean") {
                if (payload.isAlive) {
                    setShowX32NotReachable(false);
                } else {
                    triggerX32NotReachable();
                }
            }
        };

        return () => {
            eventSource.close();
        };
    }, []);

    if (showX32NotReachable === true) {
        return (
            <Page title="Audio" withBefore help={"/help/audio"} withSettings>
                <X32NotReachableVirtualPage onOk={dismissX32NotReachable} />
            </Page>
        );
    }

    return (
        <Page title="Audio" withBefore help={"/help/audio"} withSettings>
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

                <GridButton
                    onClick={async () => {
                        const [, err] = await tryCatch(loadDefaultAudioScene());
                        if (err) {
                            console.error(err);
                            setShowX32NotReachable(true);
                        }
                    }}>
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
