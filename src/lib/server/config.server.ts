import { env } from "@/lib/server/env.server";
import { tryCatchSync } from "@/utils";
import { logger } from "@/utils/logger";
import { readFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { z } from "zod";

export const configSchema = z.object({
    audio: z.object({
        x32: z.object({
            host: z.string(),
            port: z.number().int().min(1).max(65535).default(10023),
        }),
        channel: z
            .array(
                z.object({
                    name: z.string().nonempty(),
                    path: z.string().regex(/^\/[a-zA-Z0-9_/]*[a-zA-Z0-9_]$/),
                }),
            )
            .max(8, "There can be at most 8 audio channels."),
    }),
    beamer: z.object({
        ptmahdbt42: z.object({
            host: z.string(),
            port: z.number().int().min(1).max(65535).default(80),
        }),
    }),
    lighting: z
        .object({
            artnet: z.object({
                host: z.string().default("255.255.255.255"),
                port: z.number().int().min(1).max(65535).default(6454),
                broadcast: z.boolean().default(true),
            }),
            fixture_types: z.record(z.string().nonempty(), z.record(z.string().nonempty(), z.enum(["generic"]))),
            fixtures: z.record(
                z.string().nonempty(),
                z.object({
                    type: z.string().nonempty(),
                    universe: z.number().int().min(0).max(15),
                    start_address: z.number().int().min(1).max(512),
                }),
            ),
            scenes: z
                .record(
                    z.string().nonempty(),
                    z.object({
                        type: z.enum(["default"]).default("default"),
                        reset: z.boolean().default(false),
                        values: z.array(
                            z.object({
                                fixture: z.string().nonempty(),
                                channel: z.string().nonempty(),
                                value: z.number().int().min(0).max(255),
                            }),
                        ),
                    }),
                )
                .refine((scenes) => Object.keys(scenes).length <= 12, {
                    message: "There can be at most 12 scenes.",
                }),
        })
        .transform((lighting) => {
            return {
                artnet: lighting.artnet,
                scenes: Object.fromEntries(
                    Object.entries(lighting.scenes).map(([sceneName, sceneData]) => {
                        return [
                            sceneName,
                            {
                                type: sceneData.type,
                                reset: sceneData.reset,
                                values: sceneData.values.map((value) => {
                                    const fixture = lighting.fixtures[value.fixture];

                                    const channelIndex = Object.keys(lighting.fixture_types[fixture.type]).indexOf(
                                        value.channel,
                                    );
                                    if (channelIndex === -1) {
                                        throw new Error(
                                            `Channel "${value.channel}" not found for fixture type "${fixture.type}" in scene "${sceneName}"`,
                                        );
                                    }

                                    return {
                                        universe: fixture.universe,
                                        address: fixture.start_address + channelIndex,
                                        value: value.value,
                                    };
                                }),
                            },
                        ];
                    }),
                ),
            };
        }),
});

export const config: z.infer<typeof configSchema> = loadConfig();

function loadConfig() {
    const log = logger("config");

    const filePath = isAbsolute(env.CONFIG_FILE) ? env.CONFIG_FILE : join(process.cwd(), env.CONFIG_FILE);

    const [configText, readError] = tryCatchSync(() => readFileSync(filePath, "utf-8"));
    if (readError) {
        log("error", readError);
        throw readError;
    }

    const [configData, parseError] = tryCatchSync(() => JSON.parse(configText));
    if (parseError) {
        log("error", parseError);
        throw parseError;
    }

    const [parsedConfig, validationError] = tryCatchSync(() => configSchema.safeParse(configData));
    if (validationError) {
        log("error", validationError);
        throw validationError;
    }

    if (!parsedConfig.success) {
        log("error", parsedConfig.error);
        throw new Error("Config validation failed");
    }

    log("info", `Loaded config from ${filePath}.`);

    return parsedConfig.data;
}
