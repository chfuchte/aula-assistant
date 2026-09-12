import { BeamerService } from "@/lib/server/beamer.server";
import { tryCatch, withCauseStack } from "@/utils";
import { logger } from "@/utils/logger";
import { createServerFn } from "@tanstack/react-start";

const log = logger("server.beamer");

export const turnBeamerOn = createServerFn({ method: "POST" }).handler(async () => {
    log("info", "Request to turn on the beamer.");

    const [result, error] = await tryCatch(BeamerService.getInstance().turnOn());
    if (error) {
        const wrapped = withCauseStack("The beamer could not be turned on.", error);
        log("error", wrapped);
        throw wrapped;
    }

    return { ok: result };
});

export const turnBeamerOff = createServerFn({ method: "POST" }).handler(async () => {
    log("info", "Request to turn off the beamer.");

    const [result, error] = await tryCatch(BeamerService.getInstance().turnOff());
    if (error) {
        const wrapped = withCauseStack("The beamer could not be turned off.", error);
        log("error", wrapped);
        throw wrapped;
    }

    return { ok: result };
});
