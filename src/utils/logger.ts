export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogMessage = string | Error;

const dateFormat = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
    timeStyle: "medium",
});

export function logger(name: string) {
    return (level: LogLevel, message: LogMessage) => {
        const formattedMessage =
            message instanceof Error ? (message.stack ?? `${message.name}: ${message.message}`) : message;

        const str = `${dateFormat.format(new Date())} ${level.toUpperCase()} --- [${name}] ${formattedMessage}`;

        if (level === "error") {
            console.error(str);
        } else {
            console.log(str);
        }
    };
}
