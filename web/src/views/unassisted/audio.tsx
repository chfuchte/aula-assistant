import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { View } from "@/components/view";
import { cn } from "cn";
import { Volume2, VolumeOff } from "lucide-react";

export function UnassistedAudioView() {
    const channels = [
        {
            id: "/main/lr",
            name: "LR",
            faderValue: 0.9,
            isMuted: false,
        },
        {
            id: "/main/mc",
            name: "Sub",
            faderValue: 0.5,
            isMuted: true,
        },
        {
            id: "/ch/01",
            name: "M1",
            faderValue: 0.5,
            isMuted: true,
        },
        {
            id: "/ch/01",
            name: "M1",
            faderValue: 0.5,
            isMuted: true,
        },
    ];

    return (
        <View className="flex flex-col gap-8 pt-4">
            {channels.map((channel, key) => (
                <div key={key} className="flex flex-row items-center justify-between gap-4">
                    <Toggle
                        variant="outline"
                        defaultChecked={!channel.isMuted}
                        className="shrink-0"
                        onClick={() => {}}
                        aria-label="Mute channel">
                        <Volume2 className="hidden stroke-muted-foreground group-data-[state=on]/toggle:block" />
                        <VolumeOff className="stroke-destructive group-data-[state=on]/toggle:hidden" />
                        <span className="ml-2">{channel.name}</span>
                    </Toggle>
                    <Slider
                        defaultValue={[channel.faderValue]}
                        className={cn("min-w-25 flex-1", channel.isMuted && "opacity-50")}
                        min={0}
                        max={1}
                        step={0.01}
                    />
                </div>
            ))}
        </View>
    );
}
