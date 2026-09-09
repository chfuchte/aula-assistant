import { type Socket, createSocket } from "node:dgram";
import { buildArtNetPackage } from "../lib/artnet.js";
import { logger } from "../utils/logger.js";

const log = logger("service.lighting");

type Scenes = Record<
    string,
    {
        reset: boolean;
        type: "default" | "power-on" | "power-off";
        values: Array<{ universe: number; address: number; value: number }>;
    }
>;

export class LightingService {
    private static _instance: LightingService;

    private host: string;
    private port: number;
    private data: Array<Uint8ClampedArray> = [new Uint8ClampedArray(512).fill(0)];
    private socket: Socket;
    private scenes: Scenes;

    private constructor(host: string, port: number, broadcast = false, scenes: Scenes) {
        this.host = host;
        this.port = port;
        this.scenes = scenes;

        this.socket = createSocket("udp4");
        this.socket.bind(0, "0.0.0.0", () => {
            if (broadcast) {
                this.socket.setBroadcast(true);
            }
        });

        this.socket.connect(this.port, this.host, () => {});

        this.socket.on("error", (err) => {
            log("error", `Socket error: ${err.message}`);
            this.socket.close();
            this.reinitializeSocket();
        });

        this.socket.on("close", () => {});
    }

    private reinitializeSocket() {
        this.socket = createSocket("udp4");
        this.socket.connect(this.port, this.host, () => {});
        log("info", "Reinitializing socket.");

        this.socket.on("error", (err) => {
            log("error", `Socket error: ${err.message}`);
            this.socket.close();
            this.reinitializeSocket();
        });

        this.socket.on("close", () => {});
    }

    public static initialize(host: string, port: number, broadcast = false, scenes: Scenes): void {
        if (LightingService._instance) {
            throw new Error("LightingService is already initialized.");
        }

        LightingService._instance = new LightingService(host, port, broadcast, scenes);
    }

    public static getInstance(): LightingService {
        if (!LightingService._instance) {
            throw new Error("LightingService is not initialized. Call LightingService.initialize first.");
        }

        return LightingService._instance;
    }

    public async triggerScene(sceneName: string): Promise<void> {
        const scene = this.scenes[sceneName];
        if (!scene) {
            throw new Error(`Scene "${sceneName}" not found.`);
        }

        if (scene.reset) {
            for (let i = 0; i < this.data.length; i++) {
                this.data[i] = new Uint8ClampedArray(512).fill(0);
            }
        }

        for (const { universe, address, value } of scene.values) {
            this.set(universe, address, value);
        }

        for (const { universe } of scene.values) {
            await this.send(universe);
        }
    }

    public close(): void {
        this.socket.close();
    }

    private set(universe: number, channel: number, value: number): void {
        if (universe < 0) {
            throw new Error("Universe must be a non-negative integer.");
        }

        if (channel < 1 || channel > 512) {
            throw new Error("Channel must be between 1 and 512.");
        }

        if (value < 0 || value > 255) {
            throw new Error("Value must be between 0 and 255.");
        }

        if (!this.data[universe]) {
            this.data[universe] = new Uint8ClampedArray(512).fill(0);
        }

        this.data[universe][channel - 1] = value;
    }

    private async send(universe: number | undefined = undefined): Promise<void> {
        if (universe === undefined) {
            this.data.forEach((universeData, universe) => {
                let buffer = buildArtNetPackage(universe, universeData);
                this.socket.send(buffer, (err) => {
                    if (err) {
                        throw err;
                    } else {
                    }
                });
            });
        } else {
            if (!this.data[universe]) {
                throw new Error("Universe not initialized.");
            }

            let buffer = buildArtNetPackage(universe, this.data[universe]);
            this.socket.send(buffer, (err) => {
                if (err) {
                    throw err;
                } else {
                }
            });
        }
    }
}
