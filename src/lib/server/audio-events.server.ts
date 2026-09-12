import type { AudioChannelState } from "./audio.server";

export type AudioStreamState = {
    channels: AudioChannelState[];
    isAlive: boolean;
    fatalError?: string | null;
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
        listener(state);
    });
}
