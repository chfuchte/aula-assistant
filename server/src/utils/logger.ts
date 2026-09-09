export type LogLevel = "debug" | "info" | "warn" | "error";

const dateFormat = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
    timeStyle: "medium",
});

export function logger(name: string) {
    return (level: LogLevel, message: string) => {
        const str = `${dateFormat.format(new Date())} ${level.toUpperCase()} --- [${name}] ${message}`;

        if (level === "error") {
            console.error(str);
        } else {
            console.log(str);
        }
    };
}
