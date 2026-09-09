import { Router } from "express";
import { config } from "../config/index.js";
import { LightingService } from "../service/lighting.js";
import { logger } from "../utils/logger.js";

const log = logger("server.routes.lighting");

export function lightingRouter(): Router {
    const router = Router();

    router.get("/scenes", async (_, res) => {
        const scenes = Object.entries(config.lighting.scenes).map(([name, scene]) => ({
            name,
            reset: scene.reset,
            type: scene.type,
        }));

        res.status(200).json(scenes);
    });

    router.post("/scenes/:sceneName", async (req, res) => {
        const sceneName = req.params.sceneName;
        const scene = config.lighting.scenes[sceneName];
        if (!scene) {
            res.status(404).json({ message: `Scene '${sceneName}' not found` });
            return;
        }

        const lightingService = LightingService.getInstance();
        await lightingService.triggerScene(sceneName);

        res.status(200).json({ message: `Scene '${sceneName}' triggered` });
    });

    return router;
}
