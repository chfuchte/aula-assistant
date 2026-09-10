import "@tanstack/react-start/server-only";

import { env } from "@/lib/env.server";
import { tryCatchSync } from "@/utils";
import { logger } from "@/utils/logger";
import { readFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { z } from "zod";

type Config = z.infer<typeof configSchema>;

export const config: Config = loadConfig();

function loadConfig() {
    const log = logger("config");

    const filePath = isAbsolute(env.CONFIG_FILE) ? env.CONFIG_FILE : join(process.cwd(), env.CONFIG_FILE);

    const [configText, readError] = tryCatchSync(() => readFileSync(filePath, "utf-8"));
    if (readError) {
        process.exit(1);
    }

    const [configData, parseError] = tryCatchSync(() => JSON.parse(configText));
    if (parseError) {
        process.exit(1);
    }

    const parsedConfig = configSchema.safeParse(configData);
    if (!parsedConfig.success) {
        process.exit(1);
    }

    return parsedConfig.data;
}

export const configSchema = z.object({
    server: z.object({
        port: z.number().int().min(1).max(65535),
        corsOrigins: z
            .array(z.string())
            .default(["*"])
            .transform((origins) => {
                let o: string[] | string = origins.map((origin) => origin.trim());

                if (o.includes("*")) {
                    o = "*";
                } else if (o.length === 1) {
                    o = o[0];
                }

                return o;
            }),
    }),
    audio: z.object({
        x32: z.object({
            host: z.string(),
            port: z.number().int().min(1).max(65535).default(10023),
        }),
        channel: z.array(
            z.object({
                name: z.string().nonempty(),
                path: z.string().regex(/^\/[a-zA-Z0-9_/]*[a-zA-Z0-9_]$/),
                type: z.enum(["microphone", "headset", "music", "jack", "audience", "mc", "lr"]),
            }),
        ),
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
            fixture_types: z.record(
                z.string().nonempty(),
                z.record(z.string().nonempty(), z.enum(["generic"]).default("generic")),
            ),
            fixtures: z.record(
                z.string().nonempty(),
                z.object({
                    type: z.string().nonempty(),
                    universe: z.number().int().min(0).max(15),
                    start_address: z.number().int().min(1).max(512),
                }),
            ),
            scenes: z.record(
                z.string().nonempty(),
                z.object({
                    type: z.enum(["default", "power-on", "power-off"]).default("default"),
                    reset: z.boolean().default(false),
                    values: z.array(
                        z.object({
                            fixture: z.string().nonempty(),
                            channel: z.string().nonempty(),
                            value: z.number().int().min(0).max(255),
                        }),
                    ),
                }),
            ),
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
