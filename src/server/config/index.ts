import "@tanstack/react-start/server-only";

import { tryCatchSync } from "@/utils";
import { logger } from "@/utils/logger";
import { readFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import type { z } from "zod";
import { env } from "./env.js";
import { configSchema } from "./schema.js";

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
