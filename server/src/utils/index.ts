export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<[T, null] | [null, E]> {
    try {
        const data = await promise;
        return [data, null];
    } catch (error) {
        return [null, error as E];
    }
}

export function tryCatchSync<T, E = Error>(fn: () => T): [T, null] | [null, E] {
    try {
        const data = fn();
        return [data, null];
    } catch (error) {
        return [null, error as E];
    }
}
