import { Page } from "@/components/router/page";
import { View } from "@/components/router/view";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import {
    getAudioChannels,
    muteAudioChannel,
    setAudioChannelFader,
    unmuteAudioChannel,
} from "@/lib/functions/audio.functions";
import type { AudioChannelState } from "@/lib/server/audio.server";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { cn } from "cn";
import { Volume2, VolumeOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/audio")({
    loader: () => getAudioChannels(),
    component: RouteComponent,
});

function RouteComponent() {
    const loadedChannels = Route.useLoaderData();
    const muteChannel = useServerFn(muteAudioChannel);
    const unmuteChannel = useServerFn(unmuteAudioChannel);
    const setChannelFader = useServerFn(setAudioChannelFader);
    const [channels, setChannels] = useState<AudioChannelState[]>(() => loadedChannels);
    const [fatalError, setFatalError] = useState<Error | null>(null);
    const [draftFaders, setDraftFaders] = useState<Record<string, number | undefined>>({});

    if (fatalError) {
        throw fatalError;
    }

    useEffect(() => {
        setChannels(loadedChannels);
    }, [loadedChannels]);

    useEffect(() => {
        const eventSource = new EventSource("/api/audio");

        eventSource.onmessage = (event) => {
            const payload = JSON.parse(event.data) as {
                channels?: AudioChannelState[];
                isAlive?: boolean;
                fatalError?: string | null;
            };

            if (payload.fatalError) {
                const error = new Error(payload.fatalError);
                (error as Error & { fatal?: true }).fatal = true;
                setFatalError(error);
                return;
            }

            if (payload.channels) {
                setChannels(payload.channels);
                setDraftFaders({});
            }

            if (typeof payload.isAlive === "boolean") {
                // Keep the source stream alive and monitor health without rendering a stale UI state.
            }
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const displayedChannels = useMemo(() => {
        return channels.map((channel) => ({
            ...channel,
            faderValue: draftFaders[channel.path] ?? channel.faderValue,
        }));
    }, [channels, draftFaders]);

    return (
        <Page title="Audio" withBefore help withSettings>
            <View className="grid grid-cols-2 grid-rows-1 gap-12 pt-4">
                <div className="grid grid-cols-1 grid-rows-4 gap-4">
                    {displayedChannels.slice(0, 4).map((channel) => (
                        <div key={channel.path} className="relative grid grid-cols-4 grid-rows-1 items-center gap-4">
                            <span className="absolute top-0 right-0 text-center text-sm text-muted-foreground">
                                {channel.name}
                            </span>
                            <Toggle
                                size="lg"
                                variant="outline"
                                pressed={!channel.isMuted}
                                onPressedChange={(pressed) => {
                                    void (pressed
                                        ? unmuteChannel({ data: { channelPath: channel.path } })
                                        : muteChannel({ data: { channelPath: channel.path } }));
                                }}
                                aria-label="Mute channel">
                                <Volume2 className="hidden stroke-muted-foreground group-data-[state=on]/toggle:block" />
                                <VolumeOff className="stroke-destructive group-data-[state=on]/toggle:hidden" />
                                <span className="sr-only">Mute/Unmute</span>
                            </Toggle>
                            <Slider
                                value={[channel.faderValue]}
                                className={cn("col-span-3 min-w-25", channel.isMuted && "opacity-50")}
                                min={0}
                                max={1}
                                step={0.01}
                                orientation="horizontal"
                                onValueChange={(value) => {
                                    setDraftFaders((current) => ({
                                        ...current,
                                        [channel.path]: value[0] ?? channel.faderValue,
                                    }));
                                }}
                                onValueCommit={(value) => {
                                    void setChannelFader({
                                        data: {
                                            channelPath: channel.path,
                                            faderValue: value[0] ?? channel.faderValue,
                                        },
                                    });
                                    setDraftFaders((current) => {
                                        const next = { ...current };
                                        delete next[channel.path];
                                        return next;
                                    });
                                }}
                            />
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 grid-rows-4 gap-4">
                    {displayedChannels.slice(4).map((channel) => (
                        <div key={channel.path} className="relative grid grid-cols-4 grid-rows-1 items-center gap-4">
                            <span className="absolute top-0 right-0 text-center text-sm text-muted-foreground">
                                {channel.name}
                            </span>
                            <Toggle
                                size="lg"
                                variant="outline"
                                pressed={!channel.isMuted}
                                className="shrink-0"
                                onPressedChange={(pressed) => {
                                    void (pressed
                                        ? unmuteChannel({ data: { channelPath: channel.path } })
                                        : muteChannel({ data: { channelPath: channel.path } }));
                                }}
                                aria-label="Mute channel">
                                <Volume2 className="hidden stroke-muted-foreground group-data-[state=on]/toggle:block" />
                                <VolumeOff className="stroke-destructive group-data-[state=on]/toggle:hidden" />
                                <span className="sr-only">Mute/Unmute</span>
                            </Toggle>
                            <Slider
                                value={[channel.faderValue]}
                                className={cn("col-span-3 min-w-25", channel.isMuted && "opacity-50")}
                                min={0}
                                max={1}
                                step={0.01}
                                orientation="horizontal"
                                onValueChange={(value) => {
                                    setDraftFaders((current) => ({
                                        ...current,
                                        [channel.path]: value[0] ?? channel.faderValue,
                                    }));
                                }}
                                onValueCommit={(value) => {
                                    void setChannelFader({
                                        data: {
                                            channelPath: channel.path,
                                            faderValue: value[0] ?? channel.faderValue,
                                        },
                                    });
                                    setDraftFaders((current) => {
                                        const next = { ...current };
                                        delete next[channel.path];
                                        return next;
                                    });
                                }}
                            />
                        </div>
                    ))}
                </div>
            </View>
        </Page>
    );
}
