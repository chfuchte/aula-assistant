import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

export const getLightingScenesQueryOptions = queryOptions({
    queryKey: ["lighting", "scenes"],
    enabled: true,
    queryFn: async function getLightingScenes() {
        const schema = z.object({
            scenes: z.array(z.string()),
        });

        const response = await fetch("/api/lighting/scenes", {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch lighting scenes: ${response.statusText}`);
        }

        const data = await response.json();

        return schema.parse(data);
    },
});

export async function postGoLightingScene(index: number) {
    const response = await fetch(`/api/lighting/scenes/${index}`, {
        method: "POST",
    });

    return response.status === 200 ? response.json() : Promise.reject(new Error("Failed to go to the lighting scene"));
}
