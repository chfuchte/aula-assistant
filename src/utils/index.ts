export type Result<TData, TError = Error> = [TData, null] | [null, TError];

export function toError(value: unknown): Error {
    if (value instanceof Error) {
        return value;
    }

    return new Error(typeof value === "string" ? value : JSON.stringify(value));
}

export function withCauseStack(message: string, cause: unknown): Error {
    const err = toError(cause);
    const wrapped = new Error(message, { cause: err });

    if (err.stack) {
        wrapped.stack = `${wrapped.name}: ${wrapped.message}\nCaused by: ${err.stack}`;
    }

    return wrapped;
}

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
