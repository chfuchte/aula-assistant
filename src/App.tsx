import { Toaster } from "@/components/ui/sonner";
import { useStartupData } from "@/contexts/startup-data";
import { MenuAppBar } from "@/components/layout/app-bar";
import { cn } from "@/lib/utils";
import { Views } from "@/views";

import "@/styles/global.css";

export function App() {
    const startUpData = useStartupData();

    return (
        <>
            {startUpData.show_appbar ? <MenuAppBar /> : null}

            <main
                className={cn(
                    "w-full",
                    startUpData.show_appbar ? "mt-10 min-h-[calc(100dvh-(var(--spacing)*10))]" : "mt-0 min-h-dvh",
                )}>
                <Views />
            </main>

            <Toaster duration={1000} visibleToasts={1} position="bottom-center" richColors />
        </>
    );
}
