import { config } from "./config.server";
import { sendRS232Command } from "./ptmahdbt42.server";

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
            BeamerService._instance = new BeamerService(config.beamer.ptmahdbt42.host, config.beamer.ptmahdbt42.port);
        }

        return BeamerService._instance;
    }

    public async turnOn() {
        await sendRS232Command(this.host, this.port, BEAMER_PON);
    }

    public async turnOff() {
        await sendRS232Command(this.host, this.port, BEAMER_POF);
    }
}
