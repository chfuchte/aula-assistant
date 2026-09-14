export type Result<TData, TError = Error> = [TData, null] | [null, TError];

export async function tryCatch<T, TErr = Error>(promise: Promise<T>): Promise<Result<T, TErr>> {
    try {
        const data = await promise;
        return [data, null];
    } catch (error) {
        return [null, error as TErr];
    }
}

export function tryCatchSync<T, TErr = Error>(fn: () => T): Result<T, TErr> {
    try {
        const data = fn();
        return [data, null];
    } catch (error) {
        return [null, error as TErr];
    }
}

const dateFormat = new Intl.DateTimeFormat("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
});

export function getLogger(name: string) {
    return (type: "INFO" | "WARN" | "ERROR" | "DEBUG", message: string, ...args: any[]) => {
        if (type === "ERROR") {
            console.error(`[${dateFormat.format(new Date())}] [${type}] ${name} --- ${message}`, ...args);
        } else {
            console.log(`[${dateFormat.format(new Date())}] [${type}] ${name} --- ${message}`, ...args);
        }
    };
}
