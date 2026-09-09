import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "./config/index.js";
import { audioRouter } from "./routes/audio.js";
import { beamerRouter } from "./routes/beamer.js";
import { lightingRouter } from "./routes/lighting.js";
import { AudioService } from "./service/audio.js";
import { BeamerService } from "./service/beamer.js";
import { LightingService } from "./service/lighting.js";
import { logger } from "./utils/logger.js";

const log = logger("server");

const app = express()
    .use(express.json())
    .use(
        cors({
            origin: config.server.corsOrigins,
            credentials: false,
        }),
    );

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: config.server.corsOrigins,
        credentials: false,
    },
});

AudioService.initialize(config.audio.x32.host, config.audio.x32.port);
BeamerService.initialize(config.beamer.ptmahdbt42.host, config.beamer.ptmahdbt42.port);
LightingService.initialize(
    config.lighting.artnet.host,
    config.lighting.artnet.port,
    config.lighting.artnet.broadcast,
    config.lighting.scenes,
);

config.audio.channel.forEach((channel) => {
    AudioService.getInstance().onChannelMute(channel.path, (isMuted) => {
        if (io.engine.clientsCount > 0) {
            io.emit(`audio:channel:mute?${channel.path}`, { muted: isMuted });
        }
    });

    AudioService.getInstance().onChannelFader(channel.path, (faderValue) => {
        if (io.engine.clientsCount > 0) {
            io.emit(`audio:channel:fader?${channel.path}`, { value: faderValue });
        }
    });
});

setInterval(() => {
    if (io.engine.clientsCount > 0) {
        io.emit("audio:alive", { alive: AudioService.getInstance().isAlive() });
    }
}, 10_000);

io.on("connection", (socket) => {
    if (io.engine.clientsCount === 1) {
        AudioService.getInstance().startListenInterval();
    }

    socket.on("disconnect", () => {
        if (io.engine.clientsCount === 0) {
            AudioService.getInstance().stopListenInterval();
        }
    });
});

app.use("/api/audio", audioRouter());
app.use("/api/beamer", beamerRouter());
app.use("/api/lighting", lightingRouter());

server.listen(config.server.port, () => {
    log("info", `Server is running on port ${config.server.port}`);
});
