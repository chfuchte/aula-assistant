import { config } from "@/lib/server/config.server";
import { LightingService } from "@/lib/server/lighting.server";
import { getLogger, tryCatchSync } from "@/lib/utils";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const log = getLogger("lighting.functions");

export const getLightingScenes = createServerFn({ method: "GET" }).handler(
    async (): Promise<
        {
            name: string;
        }[]
    > => {
        log("DEBUG", "Getting lighting scenes");
        const scenes = Object.keys(config.lighting.scenes).map((name) => ({ name }));

        return scenes;
    },
);

export const triggerLightingScene = createServerFn({ method: "POST" })
    .validator(z.object({ sceneName: z.string().nonempty() }))
    .handler(async ({ data }): Promise<null> => {
        log("DEBUG", `Triggering lighting scene: ${data.sceneName}`);
        const [, error] = tryCatchSync(() => LightingService.getInstance().triggerScene(data.sceneName));

        if (error) {
            log("ERROR", `Failed to trigger lighting scene: ${data.sceneName}`, error);
            throw new Error(`Failed to trigger lighting scene: ${data.sceneName}`);
        }

        return null;
    });
