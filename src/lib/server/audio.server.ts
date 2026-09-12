import { tryCatchSync } from "@/utils/index";
import { logger } from "@/utils/logger";
import type { Socket } from "node:dgram";
import { createSocket } from "node:dgram";
import type { OSCArgument } from "osc-min";
import { fromBuffer, toBuffer } from "osc-min";
import { publishAudioState } from "./audio-events.server";
import { config } from "./config.server";

const log = logger("service.audio");

export const CHANNEL_FADER_DELTA = 0.15;

export type AudioChannelState = {
    name: string;
    path: string;
    isMuted: boolean;
    faderValue: number;
};

export class AudioService {
    private static _instance: AudioService | undefined;

    private host: string;
    private port: number;
    private socket: Socket;
    private interval: NodeJS.Timeout | null = null;
    private listening = false;
    private lastMessageReceived = 0;
    private lastPublishedAlive: boolean | null = null;
    private fatalNetworkError: string | null = null;
    private channelState = new Map<string, AudioChannelState>();
    private listeners: Array<{
        address: string;
        callback: (args: OSCArgument[]) => void;
    }> = [];

    private constructor(host: string, port: number) {
        this.host = host;
        this.port = port;

        config.audio.channel.forEach((channel, index) => {
            this.channelState.set(channel.path, {
                ...channel,
                isMuted: false,
                faderValue: index === 0 ? 0.9 : 0.5,
            });
        });

        this.socket = createSocket("udp4");
        this.socket.bind(0, "0.0.0.0");

        this.socket.connect(this.port, this.host, () => {});

        this.socket.on("error", (err) => {
            log("error", `Audio socket error: ${err.message}`);
            this.socket.close();
            this.markFatalNetworkError(`Audio socket error: ${err.message}`);
        });

        this.socket.on("close", () => {});
    }

    public static getInstance(): AudioService {
        if (!AudioService._instance) {
            log("info", "Initializing audio service.");
            AudioService._instance = new AudioService(config.audio.x32.host, config.audio.x32.port);
        }

        return AudioService._instance;
    }

    public getChannels(): AudioChannelState[] {
        return config.audio.channel.map((channel) => {
            const state = this.channelState.get(channel.path);

            if (state) {
                return state;
            }

            return {
                ...channel,
                isMuted: false,
                faderValue: 0.5,
            };
        });
    }

    public getChannelState(channelPath: string): AudioChannelState | undefined {
        return this.channelState.get(channelPath);
    }

    public startListenInterval() {
        if (this.listening) {
            return;
        }

        log("debug", "Starting audio listen interval.");
        this.listening = true;
        this.socket.on("message", (buffer, _) => {
            const [data, err] = tryCatchSync(() => fromBuffer(buffer));
            if (err) {
                return;
            }

            if (data.oscType === "message") {
                const msg = data;
                this.lastMessageReceived = Date.now();
                this.applyIncomingState(msg.address, Array.isArray(msg.args) ? msg.args : [msg.args]);
                this.notifyListeners(msg.address, Array.isArray(msg.args) ? msg.args : [msg.args]);
            }
        });

        this.interval = setInterval(() => {
            this.sendOSC("/status");
            this.sendOSC("/xremote");
            this.publishAudioStateIfChanged();
        }, 1000);

        this.publishAudioState();
    }

    public stopListenInterval() {
        if (!this.listening) {
            return;
        }

        log("debug", "Stopping audio listen interval.");
        this.listening = false;
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

    public getFatalNetworkError(): string | null {
        return this.fatalNetworkError;
    }

    public loadScene(sceneNumber: number) {
        log("debug", `Loading audio scene ${sceneNumber}.`);
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
        log("debug", `Muting audio channel ${channelPath}.`);
        this.updateChannelState(channelPath, { isMuted: true });
        this.sendOSC(`${channelPath}/mix/on`, 0);
        this.publishAudioState();
    }

    public unmuteChannel(channelPath: string) {
        log("debug", `Unmuting audio channel ${channelPath}.`);
        this.updateChannelState(channelPath, { isMuted: false });
        this.sendOSC(`${channelPath}/mix/on`, 1);
        this.publishAudioState();
    }

    public setChannelFader(channelPath: string, faderValue: number) {
        log("debug", `Setting audio channel ${channelPath} fader to ${faderValue}.`);
        this.updateChannelState(channelPath, { faderValue });
        this.sendOSC(`${channelPath}/mix/fader`, faderValue);
        this.publishAudioState();
    }

    public close(): void {
        this.socket.close();
    }

    private addListener(address: string, callback: (args: OSCArgument[]) => void) {
        const listener = { address, callback };
        this.listeners.push(listener);

        return () => {
            this.listeners = this.listeners.filter((currentListener) => currentListener !== listener);
        };
    }

    private notifyListeners(address: string, args: OSCArgument[]) {
        this.listeners.forEach((listener) => {
            if (listener.address === address) {
                listener.callback(args);
            }
        });
    }

    private applyIncomingState(address: string, args: OSCArgument[]) {
        const match = address.match(/^(.*)\/mix\/(on|fader)$/);
        if (!match) {
            return;
        }

        const channelPath = match[1];
        const channel = this.channelState.get(channelPath);
        if (!channel) {
            return;
        }

        if (match[2] === "on") {
            channel.isMuted = args[0]?.value === 0;
        } else {
            channel.faderValue = Number(args[0]?.value ?? channel.faderValue);
        }

        this.publishAudioState();
    }

    private updateChannelState(
        channelPath: string,
        update: Partial<Pick<AudioChannelState, "isMuted" | "faderValue">>,
    ) {
        const channel = this.channelState.get(channelPath);
        if (!channel) {
            return;
        }

        if (typeof update.isMuted === "boolean") {
            channel.isMuted = update.isMuted;
        }

        if (typeof update.faderValue === "number") {
            channel.faderValue = update.faderValue;
        }
    }

    private publishAudioState() {
        publishAudioState({
            channels: this.getChannels(),
            isAlive: this.isAlive(),
            fatalError: this.fatalNetworkError,
        });
        this.lastPublishedAlive = this.isAlive();
    }

    private publishAudioStateIfChanged() {
        const isAlive = this.isAlive();
        if (this.lastPublishedAlive === isAlive) {
            return;
        }

        this.publishAudioState();
    }

    private markFatalNetworkError(message: string) {
        this.fatalNetworkError = message;
        this.stopListenInterval();
        this.publishAudioState();
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
