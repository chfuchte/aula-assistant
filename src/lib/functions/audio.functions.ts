import type { AudioChannelState } from "@/lib/server/audio.server";
import { AudioService } from "@/lib/server/audio.server";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getLogger, tryCatchSync } from "../utils";

const log = getLogger("audio.functions");

export const getAudioChannels = createServerFn({ method: "GET" }).handler(async (): Promise<AudioChannelState[]> => {
    log("DEBUG", "Fetching audio channels");
    const [channels, error] = tryCatchSync(() => AudioService.getInstance().getChannels());

    if (error) {
        log("ERROR", "Failed to get audio channels", error);
        throw new Error("Failed to get audio channels");
    }

    return channels;
});

export const muteAudioChannel = createServerFn({ method: "POST" })
    .validator(z.object({ channelPath: z.string().min(1) }))
    .handler(async ({ data }): Promise<null> => {
        log("DEBUG", "Muting audio channel", data.channelPath);
        const [, error] = tryCatchSync(() => AudioService.getInstance().muteChannel(data.channelPath));

        if (error) {
            log("ERROR", "Failed to mute audio channel", error);
            throw new Error("Failed to mute audio channel");
        }

        return null;
    });

export const unmuteAudioChannel = createServerFn({ method: "POST" })
    .validator(z.object({ channelPath: z.string().min(1) }))
    .handler(async ({ data }): Promise<null> => {
        log("DEBUG", "Unmuting audio channel", data.channelPath);
        const [, error] = tryCatchSync(() => AudioService.getInstance().unmuteChannel(data.channelPath));

        if (error) {
            log("ERROR", "Failed to unmute audio channel", error);
            throw new Error("Failed to unmute audio channel");
        }

        return null;
    });

export const setAudioChannelFader = createServerFn({ method: "POST" })
    .validator(
        z.object({
            channelPath: z.string().min(1),
            faderValue: z.number().min(0).max(1),
        }),
    )
    .handler(async ({ data }): Promise<null> => {
        log("DEBUG", "Setting audio channel fader", data.channelPath, data.faderValue);
        const [, error] = tryCatchSync(() =>
            AudioService.getInstance().setChannelFader(data.channelPath, data.faderValue),
        );

        if (error) {
            log("ERROR", "Failed to set audio channel fader", error);
            throw new Error("Failed to set audio channel fader");
        }

        return null;
    });

export const loadDefaultAudioScene = createServerFn({ method: "POST" }).handler(async (): Promise<null> => {
    log("DEBUG", "Loading default audio scene");
    const [, error] = tryCatchSync(() => AudioService.getInstance().loadDefaultScene());

    if (error) {
        log("ERROR", "Failed to load default audio scene", error);
        throw new Error("Failed to load default audio scene");
    }

    return null;
});
