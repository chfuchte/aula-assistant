import type { Socket } from "node:dgram";
import { createSocket } from "node:dgram";
import { buildArtNetPackage } from "./artnet.server";
import { config } from "./config.server";

type Scenes = Record<
    string,
    {
        reset: boolean;
        type: "default" | "power-on" | "power-off";
        values: Array<{ universe: number; address: number; value: number }>;
    }
>;

export class LightingService {
    private static _instance: LightingService | undefined;

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

        this.socket.on("error", (_err) => {});

        this.socket.on("close", () => {});
    }

    public static getInstance(): LightingService {
        if (!LightingService._instance) {
            const { artnet, scenes } = config.lighting;
            LightingService._instance = new LightingService(artnet.host, artnet.port, artnet.broadcast, scenes);
        }

        return LightingService._instance;
    }

    public triggerScene(sceneName: string) {
        const scene = this.scenes[sceneName];

        if (scene.reset) {
            for (let i = 0; i < this.data.length; i++) {
                this.data[i] = new Uint8ClampedArray(512).fill(0);
            }
        }

        for (const { universe, address, value } of scene.values) {
            this.set(universe, address, value);
        }

        for (const { universe } of scene.values) {
            this.send(universe);
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

    private send(universe: number | undefined = undefined) {
        if (universe === undefined) {
            this.data.forEach((data, uni) => {
                const buffer = buildArtNetPackage(uni, data);
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

            const buffer = buildArtNetPackage(universe, this.data[universe]);
            this.socket.send(buffer, this.port, this.host, (err) => {
                if (err) {
                    throw err;
                } else {
                }
            });
        }
    }
}
