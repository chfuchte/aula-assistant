import { AudioService } from "@/lib/server/audio.server";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { config } from "../server/config.server";

export const getAudioChannels = createServerFn({ method: "GET" }).handler(async () => {
    const channels = AudioService.getInstance().getChannels();

    return channels;
});

export const muteAudioChannel = createServerFn({ method: "POST" })
    .validator(z.object({ channelPath: z.string().min(1) }))
    .handler(async ({ data }) => {
        AudioService.getInstance().muteChannel(data.channelPath);
    });

export const unmuteAudioChannel = createServerFn({ method: "POST" })
    .validator(z.object({ channelPath: z.string().min(1) }))
    .handler(async ({ data }) => {
        AudioService.getInstance().unmuteChannel(data.channelPath);
    });

export const setAudioChannelFader = createServerFn({ method: "POST" })
    .validator(
        z.object({
            channelPath: z.string().min(1),
            faderValue: z.number().min(0).max(1),
        }),
    )
    .handler(async ({ data }) => {
        AudioService.getInstance().setChannelFader(data.channelPath, data.faderValue);
    });

export const loadDefaultAudioScene = createServerFn({ method: "POST" }).handler(async () => {
    AudioService.getInstance().loadScene(config.audio.default_szene);
});
