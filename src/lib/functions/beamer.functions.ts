import { BeamerService } from "@/lib/server/beamer.server";
import { getLogger, tryCatch } from "@/lib/utils";
import { createServerFn } from "@tanstack/react-start";

const log = getLogger("beamer.functions");

export const turnBeamerOn = createServerFn({ method: "POST" }).handler(async (): Promise<null> => {
    log("DEBUG", "Turning beamer on");
    const [, error] = await tryCatch(BeamerService.getInstance().turnOn());

    if (error) {
        log("ERROR", "Failed to turn beamer on", error);
        throw new Error("Failed to turn beamer on");
    }

    return null;
});

export const turnBeamerOff = createServerFn({ method: "POST" }).handler(async (): Promise<null> => {
    log("DEBUG", "Turning beamer off");
    const [, error] = await tryCatch(BeamerService.getInstance().turnOff());

    if (error) {
        log("ERROR", "Failed to turn beamer off", error);
        throw new Error("Failed to turn beamer off");
    }

    return null;
});
