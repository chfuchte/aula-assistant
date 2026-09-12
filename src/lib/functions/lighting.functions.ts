import { config } from "@/lib/server/config.server";
import { LightingService } from "@/lib/server/lighting.server";
import { tryCatch, tryCatchSync, withCauseStack } from "@/utils";
import { logger } from "@/utils/logger";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const log = logger("server.lighting");

export const getLightingScenes = createServerFn({ method: "GET" }).handler(async () => {
    log("info", "Requesting lighting scene list.");

    const [scenes, error] = tryCatchSync(() => Object.keys(config.lighting.scenes).map((name) => ({ name })));
    if (error) {
        const wrapped = withCauseStack("The lighting scenes could not be loaded.", error);
        log("error", wrapped);
        throw wrapped;
    }

    return scenes;
});

export const triggerLightingScene = createServerFn({ method: "POST" })
    .validator(z.object({ sceneName: z.string().nonempty() }))
    .handler(async ({ data }) => {
        log("info", `Request to trigger lighting scene "${data.sceneName}".`);

        const [_, error] = await tryCatch(LightingService.getInstance().triggerScene(data.sceneName));
        if (error) {
            const wrapped = withCauseStack(`The lighting scene "${data.sceneName}" could not be triggered.`, error);
            log("error", wrapped);
            throw wrapped;
        }

        return { ok: true };
    });
