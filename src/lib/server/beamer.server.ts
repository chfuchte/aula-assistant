import "@tanstack/react-start/server-only";

import { logger } from "@/utils/logger";
import { sendRS232Command } from "./ptmahdbt42.server";

const BEAMER_PON = "02 50 4F 4E 03";
const BEAMER_POF = "02 50 4F 46 03";

const log = logger("service.beamer");

export class BeamerService {
    private static _instance: BeamerService | undefined;

    private host: string;
    private port: number;

    private constructor(host: string, port: number) {
        this.host = host;
        this.port = port;
    }

    public static initialize(host: string, port: number): void {
        if (BeamerService._instance) {
            throw new Error("BeamerService is already initialized.");
        }

        BeamerService._instance = new BeamerService(host, port);
    }

    public static getInstance(): BeamerService {
        if (!BeamerService._instance) {
            throw new Error("BeamerService is not initialized. Call BeamerService.initialize first.");
        }

        return BeamerService._instance;
    }

    public async turnOn() {
        const success = await sendRS232Command(this.host, this.port, BEAMER_PON);

        return success;
    }

    public async turnOff() {
        const success = await sendRS232Command(this.host, this.port, BEAMER_POF);

        return success;
    }
}
