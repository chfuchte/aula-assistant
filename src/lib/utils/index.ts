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
