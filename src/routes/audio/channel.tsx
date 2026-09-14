import { Page } from "@/components/page";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { View } from "@/components/view";
import {
    getAudioChannels,
    muteAudioChannel,
    setAudioChannelFader,
    unmuteAudioChannel,
} from "@/lib/functions/audio.functions";
import type { AudioChannelState } from "@/lib/server/audio.server";
import { tryCatch } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { cn } from "cn";
import { Volume2, VolumeOff } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/audio/channel")({
    loader: () => getAudioChannels(),
    component: RouteComponent,
    head: () => ({
        meta: [
            {
                title: "ATec Aula Assistant // Audio-Känale",
            },
        ],
    }),
});

function RouteComponent() {
    const loadedChannels = Route.useLoaderData();
    const muteChannel = useServerFn(muteAudioChannel);
    const unmuteChannel = useServerFn(unmuteAudioChannel);
    const setChannelFader = useServerFn(setAudioChannelFader);
    const [channels, setChannels] = useState<AudioChannelState[]>(() => loadedChannels);

    useEffect(() => {
        setChannels(loadedChannels);
    }, [loadedChannels]);

    useEffect(() => {
        const eventSource = new EventSource("/api/audio");

        eventSource.onmessage = (event) => {
            const payload = JSON.parse(event.data) as {
                channels?: AudioChannelState[];
                isAlive?: boolean;
            };

            if (payload.channels) {
                setChannels(payload.channels);
            }

            if (typeof payload.isAlive === "boolean") {
                if (!payload.isAlive) {
                    alert("Mischpult ist offline. Bitte überprüfe die Verbindung.");
                }
            }
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <Page title="Audio-Känale" withBefore help={"/help/audio"} withSettings>
            <View className="grid grid-cols-2 grid-rows-4 gap-x-12 gap-y-4 pt-4">
                {channels.map((channel) => (
                    <div key={channel.path} className="relative grid grid-cols-4 grid-rows-1 items-center gap-4">
                        <span className="absolute top-0 right-0 text-center text-sm text-muted-foreground">
                            {channel.name}
                        </span>
                        <Toggle
                            variant="outline"
                            pressed={!channel.isMuted}
                            onPressedChange={async (pressed) => {
                                const [, error] = await tryCatch(
                                    pressed
                                        ? unmuteChannel({ data: { channelPath: channel.path } })
                                        : muteChannel({ data: { channelPath: channel.path } }),
                                );
                                if (error) {
                                    alert(`Fehler beim ${pressed ? "entmuten" : "muten"} des Kanals: ${error.message}`);
                                }
                            }}
                            aria-label="Mute channel">
                            <Volume2 className="hidden stroke-muted-foreground group-data-[state=on]/toggle:block" />
                            <VolumeOff className="stroke-destructive group-data-[state=on]/toggle:hidden" />
                        </Toggle>
                        <Slider
                            value={[channel.faderValue]}
                            className={cn("col-span-3 min-w-25", channel.isMuted && "opacity-50")}
                            min={0}
                            max={1}
                            step={0.01}
                            orientation="horizontal"
                            onValueChange={async (value) => {
                                const [, error] = await tryCatch(
                                    setChannelFader({
                                        data: {
                                            channelPath: channel.path,
                                            faderValue: value[0] ?? channel.faderValue,
                                        },
                                    }),
                                );
                                if (error) {
                                    alert(`Fehler beim Setzen des Faderwerts: ${error.message}`);
                                }
                            }}
                        />
                    </div>
                ))}{" "}
            </View>
        </Page>
    );
}
