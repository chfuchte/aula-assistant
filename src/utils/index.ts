export async function tryCatch<T, TErr = Error>(promise: Promise<T>): Promise<[T, null] | [null, TErr]> {
    try {
        const data = await promise;
        return [data, null];
    } catch (error) {
        return [null, error as TErr];
    }
}

export function tryCatchSync<T, TErr = Error>(fn: () => T): [T, null] | [null, TErr] {
    try {
        const data = fn();
        return [data, null];
    } catch (error) {
        return [null, error as TErr];
    }
}
