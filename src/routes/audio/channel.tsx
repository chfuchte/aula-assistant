import { Page } from "@/components/page";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { View } from "@/components/view";
import { X32NotReachableVirtualPage } from "@/components/x32-not-reachable";
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
import { useEffect, useRef, useState } from "react";

const X32_UNREACHABLE_SUPPRESS_MS = 10_000;

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
    const [showX32NotReachable, setShowX32NotReachable] = useState<boolean>(false);
    const suppressUntilRef = useRef<number>(0);
    const sendFaderUpdateRef = useRef<Record<string, NodeJS.Timeout>>({});
    const [localFaderValues, setLocalFaderValues] = useState<Record<string, number>>({});

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
            <Page title="Audio-Känale" withBefore help={"/help/audio"} withSettings>
                <X32NotReachableVirtualPage onOk={dismissX32NotReachable} />
            </Page>
        );
    }

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
                                    triggerX32NotReachable();
                                }
                            }}
                            aria-label="Mute channel">
                            <Volume2 className="hidden stroke-muted-foreground group-data-[state=on]/toggle:block" />
                            <VolumeOff className="stroke-destructive group-data-[state=on]/toggle:hidden" />
                        </Toggle>
                        <Slider
                            value={[localFaderValues[channel.path] ?? channel.faderValue]}
                            className={cn("col-span-3 min-w-25", channel.isMuted && "opacity-50")}
                            min={0}
                            max={1}
                            step={0.01}
                            orientation="horizontal"
                            onValueChange={(value) => {
                                const nextValue = value[0] ?? channel.faderValue;
                                setLocalFaderValues((prev) => ({ ...prev, [channel.path]: nextValue }));

                                const existingTimeout = sendFaderUpdateRef.current[channel.path];
                                clearTimeout(existingTimeout);

                                sendFaderUpdateRef.current[channel.path] = setTimeout(async () => {
                                    delete sendFaderUpdateRef.current[channel.path];

                                    const [, error] = await tryCatch(
                                        setChannelFader({
                                            data: {
                                                channelPath: channel.path,
                                                faderValue: nextValue,
                                            },
                                        }),
                                    );

                                    if (error) {
                                        triggerX32NotReachable();
                                    }

                                    setLocalFaderValues((prev) => {
                                        const { [channel.path]: _removed, ...rest } = prev;
                                        return rest;
                                    });
                                }, 500);
                            }}
                        />
                    </div>
                ))}
            </View>
        </Page>
    );
}
