import { AudioService } from "@/lib/server/audio.server";
import { tryCatchSync, withCauseStack } from "@/utils";
import { logger } from "@/utils/logger";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const log = logger("server.audio");

export const getAudioChannels = createServerFn({ method: "GET" }).handler(async () => {
    log("info", "Requesting audio channel list.");

    const [channels, error] = tryCatchSync(() => AudioService.getInstance().getChannels());
    if (error) {
        const wrapped = withCauseStack("The audio channel list could not be loaded.", error);
        log("error", wrapped);
        throw wrapped;
    }

    return channels;
});

export const muteAudioChannel = createServerFn({ method: "POST" })
    .validator(z.object({ channelPath: z.string().min(1) }))
    .handler(async ({ data }) => {
        log("info", `Request to mute audio channel "${data.channelPath}".`);

        const [_, error] = tryCatchSync(() => AudioService.getInstance().muteChannel(data.channelPath));
        if (error) {
            const wrapped = withCauseStack(`The audio channel "${data.channelPath}" could not be muted.`, error);
            log("error", wrapped);
            throw wrapped;
        }

        return { ok: true };
    });

export const unmuteAudioChannel = createServerFn({ method: "POST" })
    .validator(z.object({ channelPath: z.string().min(1) }))
    .handler(async ({ data }) => {
        log("info", `Request to unmute audio channel "${data.channelPath}".`);

        const [_, error] = tryCatchSync(() => AudioService.getInstance().unmuteChannel(data.channelPath));
        if (error) {
            const wrapped = withCauseStack(`The audio channel "${data.channelPath}" could not be unmuted.`, error);
            log("error", wrapped);
            throw wrapped;
        }

        return { ok: true };
    });

export const setAudioChannelFader = createServerFn({ method: "POST" })
    .validator(
        z.object({
            channelPath: z.string().min(1),
            faderValue: z.number().min(0).max(1),
        }),
    )
    .handler(async ({ data }) => {
        log("info", `Request to set audio channel "${data.channelPath}" to ${data.faderValue}.`);

        const [_, error] = tryCatchSync(() =>
            AudioService.getInstance().setChannelFader(data.channelPath, data.faderValue),
        );
        if (error) {
            const wrapped = withCauseStack(
                `The audio channel "${data.channelPath}" could not be adjusted to ${data.faderValue}.`,
                error,
            );
            log("error", wrapped);
            throw wrapped;
        }

        return { ok: true };
    });
