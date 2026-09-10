import "@tanstack/react-start/server-only";

import { tryCatchSync } from "@/utils/index";
import { logger } from "@/utils/logger";
import type { Socket } from "node:dgram";
import { createSocket } from "node:dgram";
import type { OSCArgument } from "osc-min";
import { fromBuffer, toBuffer } from "osc-min";

const log = logger("service.audio");

export const CHANNEL_FADER_DELTA = 0.15;

export class AudioService {
    private static _instance: AudioService | undefined;

    private host: string;
    private port: number;
    private socket: Socket;
    private interval: NodeJS.Timeout | null = null;
    private lastMessageReceived = 0;
    private listeners: Array<{
        address: string;
        callback: (args: OSCArgument[]) => void;
    }> = [];

    private constructor(host: string, port: number) {
        this.host = host;
        this.port = port;

        this.socket = createSocket("udp4");
        this.socket.bind(0, "0.0.0.0");

        this.socket.connect(this.port, this.host, () => {});

        this.socket.on("error", (err) => {
            this.socket.close();
            this.reinitializeSocket();
        });

        this.socket.on("close", () => {});
    }

    private reinitializeSocket() {
        this.socket = createSocket("udp4");
        this.socket.bind(10024, "0.0.0.0");
        this.socket.connect(this.port, this.host, () => {});

        this.socket.on("error", (err) => {
            this.socket.close();
            this.reinitializeSocket();
        });

        this.socket.on("close", () => {});
    }

    public static initialize(host: string, port: number): void {
        if (AudioService._instance) {
            throw new Error("AudioService is already initialized.");
        }

        AudioService._instance = new AudioService(host, port);
    }

    public static getInstance(): AudioService {
        if (!AudioService._instance) {
            throw new Error("AudioService is not initialized. Call AudioService.initialize first.");
        }

        return AudioService._instance;
    }

    public startListenInterval() {
        this.socket.on("message", (buffer, _) => {
            const [data, err] = tryCatchSync(() => fromBuffer(buffer));
            if (err) {
                return;
            }

            if (data.oscType === "message") {
                const msg = data;
                this.lastMessageReceived = Date.now();
                this.notifyListeners(msg.address, Array.isArray(msg.args) ? msg.args : [msg.args]);
            }
        });

        this.interval = setInterval(() => {
            this.sendOSC("/status");
            this.sendOSC("/xremote");
        }, 1000);
    }

    public stopListenInterval() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        this.socket.removeAllListeners("message");
    }

    public isAlive(): boolean {
        const now = Date.now();
        return now - this.lastMessageReceived < 15_000; // 15 seconds threshold
    }

    public loadScene(sceneNumber: number) {
        this.sendOSC("/-action/goscene", sceneNumber);
    }

    public onChannelMute(channelPath: string, callback: (isMuted: boolean) => void) {
        this.addListener(`${channelPath}/mix/on`, (args) => {
            const isMuted = args[0].value === 0;
            callback(isMuted);
        });
    }

    public onChannelFader(channelPath: string, callback: (faderValue: number) => void) {
        this.addListener(`${channelPath}/mix/fader`, (args) => {
            const faderValue = args[0].value as number;
            callback(faderValue);
        });
    }

    public muteChannel(channelPath: string) {
        this.sendOSC(`${channelPath}/mix/on`, 0);
        this.notifyListeners(`${channelPath}/mix/on`, [{ type: "integer", value: 0 }]);
    }

    public unmuteChannel(channelPath: string) {
        this.sendOSC(`${channelPath}/mix/on`, 1);
        this.notifyListeners(`${channelPath}/mix/on`, [{ type: "integer", value: 1 }]);
    }

    public setChannelFader(channelPath: string, faderValue: number) {
        this.sendOSC(`${channelPath}/mix/fader`, faderValue);
        this.notifyListeners(`${channelPath}/mix/fader`, [{ type: "float", value: faderValue }]);
    }

    public close(): void {
        this.socket.close();
    }

    private addListener(address: string, callback: (args: OSCArgument[]) => void) {
        this.listeners.push({ address, callback });
    }

    private notifyListeners(address: string, args: OSCArgument[]) {
        this.listeners.forEach((listener) => {
            if (listener.address === address) {
                listener.callback(args);
            }
        });
    }

    private sendOSC(address: string, ...args: (string | number)[]) {
        const buffer = toBuffer({
            address,
            args: args.map<OSCArgument>((arg) => {
                if (typeof arg === "number") {
                    return { type: "float", value: arg };
                } else if (typeof arg === "string") {
                    return { type: "string", value: arg };
                } else {
                    throw new Error();
                }
            }),
        });
        this.socket.send(buffer, this.port, this.host);
    }
}
