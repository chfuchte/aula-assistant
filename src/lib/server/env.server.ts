 
import { z } from "zod";

export const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    CONFIG_FILE: z.string().default("config.json"),
});

export const env = envSchema.parse(process.env);
