import { tryCatch, withCauseStack } from "@/utils";
import { logger } from "@/utils/logger";
import { config } from "./config.server";
import { sendRS232Command } from "./ptmahdbt42.server";

const log = logger("service.beamer");

const BEAMER_PON = "02 50 4F 4E 03";
const BEAMER_POF = "02 50 4F 46 03";

export class BeamerService {
    private static _instance: BeamerService | undefined;

    private host: string;
    private port: number;

    private constructor(host: string, port: number) {
        this.host = host;
        this.port = port;
    }

    public static getInstance(): BeamerService {
        if (!BeamerService._instance) {
            logger("service.beamer")("info", "Initializing beamer service.");
            BeamerService._instance = new BeamerService(config.beamer.ptmahdbt42.host, config.beamer.ptmahdbt42.port);
        }

        return BeamerService._instance;
    }

    public async turnOn() {
        log("debug", "Turning beamer on.");

        const [success, error] = await tryCatch(sendRS232Command(this.host, this.port, BEAMER_PON));
        if (error) {
            const wrapped = withCauseStack("Failed to power on the beamer.", error);
            log("error", wrapped);
            return false;
        }

        return success;
    }

    public async turnOff() {
        log("debug", "Turning beamer off.");

        const [success, error] = await tryCatch(sendRS232Command(this.host, this.port, BEAMER_POF));
        if (error) {
            const wrapped = withCauseStack("Failed to power off the beamer.", error);
            log("error", wrapped);
            return false;
        }

        return success;
    }
}
