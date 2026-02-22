import { ViewButton } from "@/components/view-button";
import { BackArrowIcon, LockIcon, SupportIcon } from "@/components/icons";
import { ViewLocation } from "..";
import { ViewCard } from "@/components/view-card";
import { DocsQRCode } from "@/components/docs-qr-code";

export function HelpView({ onLocationSwitch }: { onLocationSwitch: (to: ViewLocation) => void }) {
    return (
        <div className="grid min-h-[inherit] grid-cols-2 grid-rows-2 gap-4 p-4 max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-start">
            <ViewButton
                title="Back to start"
                description="Return to the main menu"
                icon={<BackArrowIcon className="fill-foreground" height={48} width={48} />}
                onClick={() => onLocationSwitch("start")}
            />
            <ViewCard>
                <DocsQRCode className="max-sm:h-40" />
                <span className="-mb-2 text-center">View Documentation</span>
            </ViewCard>
            <ViewButton
                title="Advanced"
                description="Authorized users only"
                icon={<LockIcon className="fill-foreground" height={48} width={48} />}
                onClick={() => onLocationSwitch("advanced:auth")}
            />
            <ViewButton
                title="Ask for help"
                description="(We won't always be available)"
                icon={<SupportIcon className="fill-foreground" height={48} width={48} />}
                onClick={() => onLocationSwitch("help:support")}
            />
        </div>
    );
}
