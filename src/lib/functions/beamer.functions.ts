import { BeamerService } from "@/lib/server/beamer.server";
import { createServerFn } from "@tanstack/react-start";

export const turnBeamerOn = createServerFn({ method: "POST" }).handler(async () => {
    await BeamerService.getInstance().turnOn();
});

export const turnBeamerOff = createServerFn({ method: "POST" }).handler(async () => {
    await BeamerService.getInstance().turnOff();
});
