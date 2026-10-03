import { Button } from "@/components/ui/button";
import { cn } from "cn";

function GridButtonRoot({
    className,
    children,
    asChild = false,
    ...props
}: React.ComponentProps<"button"> & {
    asChild?: boolean;
}) {
    return (
        <Button
            variant="outline"
            asChild={asChild}
            className={cn(
                "@container flex size-full flex-col items-center justify-center gap-2 px-8 py-4 whitespace-normal @md:gap-4 @md:py-8",
                className,
            )}
            {...props}>
            {children}
        </Button>
    );
}

function GridButtonIcon({ className, children }: React.ComponentProps<"span">) {
    return <span className={cn("shrink-0 [&>svg]:size-6! sm:[&>svg]:size-8!", className)}>{children}</span>;
}

function GridButtonLabel({ className, children }: React.ComponentProps<"span">) {
    return (
        <span className={cn("text-base leading-tight font-semibold @xs:text-lg @sm:text-xl", className)}>
            {children}
        </span>
    );
}

function GridButtonDescription({ className, children }: React.ComponentProps<"span">) {
    return (
        <span
            className={cn(
                "text-xs leading-snug font-normal text-muted-foreground @xs:text-sm @sm:text-base",
                className,
            )}>
            {children}
        </span>
    );
}

export const GridButton = Object.assign(GridButtonRoot, {
    Icon: GridButtonIcon,
    Label: GridButtonLabel,
    Description: GridButtonDescription,
});
