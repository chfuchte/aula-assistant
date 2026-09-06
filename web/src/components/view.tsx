import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function View({ children, className }: { children?: ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                "grid min-h-[inherit] gap-4 p-4 max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-start",
                className,
            )}>
            {children}
        </div>
    );
}
