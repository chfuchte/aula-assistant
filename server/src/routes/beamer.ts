import { Router } from "express";
import { BeamerService } from "../service/beamer.js";
import { logger } from "../utils/logger.js";

const log = logger("server.routes.beamer");

export function beamerRouter(): Router {
    const router = Router();

    router.post("/turn-on", async (_, res) => {
        const beamerService = BeamerService.getInstance();
        await beamerService.turnOn();
        res.status(200).json({ message: "Beamer turned on" });
    });

    router.post("/turn-off", async (_, res) => {
        const beamerService = BeamerService.getInstance();
        await beamerService.turnOff();
        res.status(200).json({ message: "Beamer turned off" });
    });

    return router;
}
