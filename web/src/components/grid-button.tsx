import { cn } from "@/lib/utils";
import { Button } from "./ui/button"; // shadcn button

function GridButtonRoot({ className, children, ...props }: React.ComponentProps<"button">) {
    return (
        <Button
            variant="outline"
            className={cn("flex size-full flex-col items-center justify-center gap-4 p-8 whitespace-normal", className)}
            {...props}>
            {children}
        </Button>
    );
}

function GridButtonIcon({ className, children }: React.ComponentProps<"span">) {
    return <span className={cn("shrink-0 [&>svg]:size-6! sm:[&>svg]:size-8!", className)}>{children}</span>;
}

function GridButtonLabel({ className, children }: React.ComponentProps<"span">) {
    return <span className={cn("text-lg leading-tight font-semibold md:text-xl", className)}>{children}</span>;
}

function GridButtonDescription({ className, children }: React.ComponentProps<"span">) {
    return (
        <span className={cn("text-sm leading-snug font-normal text-muted-foreground md:text-base", className)}>
            {children}
        </span>
    );
}

export const GridButton = Object.assign(GridButtonRoot, {
    Icon: GridButtonIcon,
    Label: GridButtonLabel,
    Description: GridButtonDescription,
});
