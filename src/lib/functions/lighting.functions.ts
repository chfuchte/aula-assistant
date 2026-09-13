import { config } from "@/lib/server/config.server";
import { LightingService } from "@/lib/server/lighting.server";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getLightingScenes = createServerFn({ method: "GET" }).handler(async () => {
    const scenes = Object.keys(config.lighting.scenes).map((name) => ({ name }));

    return scenes;
});

export const triggerLightingScene = createServerFn({ method: "POST" })
    .validator(z.object({ sceneName: z.string().nonempty() }))
    .handler(async ({ data }) => {
        LightingService.getInstance().triggerScene(data.sceneName);
    });
