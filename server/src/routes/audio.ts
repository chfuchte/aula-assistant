import { Router } from "express";
import { config } from "../config/index.js";
import { AudioService } from "../service/audio.js";
import { logger } from "../utils/logger.js";

const log = logger("server.routes.audio");

export function audioRouter(): Router {
    const router = Router();

    router.get("/channels", async (_, res) => {
        const channels = config.audio.channel.map((channel) => channel.name);

        res.status(200).json(channels);
    });

    router.post("/channels/:channelName/mute", async (req, res) => {
        const channelName = req.params.channelName;
        const channel = config.audio.channel.find((c) => c.name === channelName);
        if (!channel) {
            res.status(404).json({ message: `Channel '${channelName}' not found` });
            return;
        }

        const audioService = AudioService.getInstance();
        audioService.muteChannel(channelName);

        res.status(200).json({ message: `Channel '${channelName}' muted` });
    });

    router.post("/channels/:channelName/unmute", async (req, res) => {
        const channelName = req.params.channelName;
        const channel = config.audio.channel.find((c) => c.name === channelName);
        if (!channel) {
            res.status(404).json({ message: `Channel '${channelName}' not found` });
            return;
        }

        const audioService = AudioService.getInstance();
        audioService.unmuteChannel(channelName);

        res.status(200).json({ message: `Channel '${channelName}' unmuted` });
    });

    router.post("/channels/:channelName/fader", async (req, res) => {
        const channelName = req.params.channelName;
        const channel = config.audio.channel.find((c) => c.name === channelName);
        if (!channel) {
            res.status(404).json({ message: `Channel '${channelName}' not found` });
            return;
        }

        const faderValue = req.body.faderValue;
        if (typeof faderValue !== "number" || faderValue < 0 || faderValue > 1) {
            res.status(400).json({ message: "Invalid fader value. Must be a number between 0 and 1." });
            return;
        }

        const audioService = AudioService.getInstance();
        audioService.setChannelFader(channelName, faderValue);

        res.status(200).json({ message: `Channel '${channelName}' fader set to ${faderValue}` });
    });

    return router;
}
