import { ViewLocation } from "..";
import { BackArrowIcon } from "@/components/icons";
import { ViewButton } from "@/components/view-button";

export function AudioView({ onLocationSwitch }: { onLocationSwitch: (to: ViewLocation) => void }) {
    const channels = []; // TODO: placeholder

    if (channels.length === 0) {
        return (
            <div className="grid min-h-[inherit] gap-4 p-4 max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-start">
                <ViewButton
                    onClick={() => onLocationSwitch("start")}
                    title="Back to start"
                    description="No channels available."
                    icon={<BackArrowIcon className="fill-foreground" height={32} width={32} />}
                />
            </div>
        );
    }

    return (
        <div className="grid min-h-[inherit] place-items-center p-4 max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-start"></div>
    );
}
