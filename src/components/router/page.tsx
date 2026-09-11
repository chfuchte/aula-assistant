import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { ArrowLeft, CircleQuestionMark, Cog } from "lucide-react";
import type { ReactNode } from "react";

type PageProps = {
    children?: ReactNode;
} & (
    | {
          fullscreen?: false;

          withBefore?: boolean;
          help?: boolean;
          withSettings?: boolean;
          title?: string;
      }
    | {
          fullscreen: true;
      }
);

export function Page(
    props: PageProps = {
        fullscreen: false,
        help: true,
        withBefore: true,
        withSettings: true,
    },
) {
    return (
        <>
            {!props.fullscreen && (
                <header className="flex h-16 flex-row items-center justify-between px-4 py-2 select-none">
                    <Button
                        size="icon"
                        variant="ghost"
                        className={props.withBefore ? "visible" : "invisible"}
                        asChild={props.withBefore}>
                        <Link to="..">
                            <ArrowLeft className="size-6" />
                        </Link>
                    </Button>

                    <h1 className="text-lg">{props.title}</h1>

                    <div className="flex flex-row items-center gap-2">
                        <Button size="icon" variant="ghost" disabled={!props.help}>
                            <Link to="/help">
                                <CircleQuestionMark className="size-6" />
                            </Link>
                        </Button>

                        <Button size="icon" variant="ghost" disabled={props.withSettings === false}>
                            <Link to="/settings">
                                <Cog className="size-6" />
                            </Link>
                        </Button>
                    </div>
                </header>
            )}

            <main className={cn("w-full", props.fullscreen ? "min-h-dvh" : "min-h-[calc(100dvh-(var(--spacing)*16))]")}>
                {props.children}
            </main>
        </>
    );
}
