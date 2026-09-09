import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function View({ children, className }: { children?: ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                "grid min-h-[inherit] gap-8 p-8 pt-2 max-md:flex max-md:flex-col max-md:items-center max-md:justify-start",
                className,
            )}>
            {children}
        </div>
    );
}
