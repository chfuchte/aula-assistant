import type { AudioChannelState } from "./audio.server";

export type AudioStreamState = {
    channels: AudioChannelState[];
    isAlive: boolean;
};

const listeners = new Set<(state: AudioStreamState) => void>();

export function subscribeAudioState(listener: (state: AudioStreamState) => void) {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}

export function hasAudioChannelListeners(): boolean {
    return listeners.size > 0;
}

export function publishAudioState(state: AudioStreamState) {
    listeners.forEach((listener) => {
        try {
            listener(state);
        } catch (error) {
            throw new Error(`Error notifying audio state listener: ${error}`);
        }
    });
}
