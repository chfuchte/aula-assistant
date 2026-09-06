export async function postBeamerOn() {
    const response = await fetch("/api/beamer/on", {
        method: "POST",
    });

    return response.status === 200 ? response.json() : Promise.reject(new Error("Failed to turn on the beamer"));
}

export async function postBeamerOff() {
    const response = await fetch("/api/beamer/off", {
        method: "POST",
    });

    return response.status === 200 ? response.json() : Promise.reject(new Error("Failed to turn off the beamer"));
}
