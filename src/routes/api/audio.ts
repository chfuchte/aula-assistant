import { hasAudioChannelListeners, subscribeAudioState } from "@/lib/server/audio-events.server";
import { AudioService } from "@/lib/server/audio.server";
import { createFileRoute } from "@tanstack/react-router";

const textEncoder = new TextEncoder();

function encodeEvent(data: unknown) {
    return textEncoder.encode(`data: ${JSON.stringify(data)}\n\n`);
}

export const Route = createFileRoute("/api/audio")({
    server: {
        handlers: {
            GET: async () => {
                const audioService = AudioService.getInstance();
                audioService.startListenInterval();

                let unsubscribe = () => {};
                let keepAlive: ReturnType<typeof setInterval> | null = null;

                const stream = new ReadableStream<Uint8Array>({
                    start(streamController) {
                        streamController.enqueue(
                            encodeEvent({
                                channels: audioService.getChannels(),
                                isAlive: audioService.isAlive(),
                                fatalError: audioService.getFatalNetworkError(),
                            }),
                        );

                        unsubscribe = subscribeAudioState((state) => {
                            streamController.enqueue(encodeEvent(state));
                        });

                        keepAlive = setInterval(() => {
                            streamController.enqueue(textEncoder.encode(`: keep-alive\n\n`));
                        }, 15000);
                    },
                    cancel() {
                        if (keepAlive) {
                            clearInterval(keepAlive);
                            keepAlive = null;
                        }

                        unsubscribe();

                        if (!hasAudioChannelListeners()) {
                            audioService.stopListenInterval();
                        }
                    },
                });

                return new Response(stream, {
                    headers: {
                        "Content-Type": "text/event-stream",
                        "Cache-Control": "no-cache, no-transform",
                        Connection: "keep-alive",
                        "X-Accel-Buffering": "no",
                    },
                });
            },
        },
    },
});
