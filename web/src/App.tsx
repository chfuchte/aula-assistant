import { Button } from "@/components/ui/button";
import { useRouter, type RouterViewKey } from "@/hooks/router";
import { cn } from "@/lib/utils";
import { DefaultView } from "@/views/default";
import { GenericHelpView } from "@/views/help/generic";
import { SettingsView } from "@/views/settings";
import { SplashScreen } from "@/views/splashscreen";
import { ArrowLeft, CircleQuestionMark, Cog } from "lucide-react";
import { UnassistedAudioView } from "./views/unassisted/audio";
import { UnassistedBeamerView } from "./views/unassisted/beamer";
import { UnassistedDefaultView } from "./views/unassisted/default";
import { UnassistedLightingView } from "./views/unassisted/lighting";

const views: Record<RouterViewKey, View> = {
    "root:splashscreen": {
        component: <SplashScreen />,
        title: "Splashscreen",
        options: {
            navigation: {
                root: true,
            },
            fullscreen: true,
            help: null,
        },
    },
    "root:default": {
        component: <DefaultView />,
        title: "Bitte wähle einen Modus aus",
        options: {
            fullscreen: false,
            navigation: {
                root: true,
            },
            help: "help:generic",
        },
    },
    settings: {
        component: <SettingsView />,
        title: "Einstellungen",
        options: {
            fullscreen: false,
            navigation: {
                root: false,
            },
            help: "help:generic",
        },
    },
    "unassisted:default": {
        component: <UnassistedDefaultView />,
        title: "Ungeführter Modus",
        options: {
            fullscreen: false,
            navigation: {
                root: false,
            },
            help: null,
        },
    },
    "unassisted:audio": {
        component: <UnassistedAudioView />,
        title: "Ungeführter Modus / Ton",
        options: {
            fullscreen: false,
            navigation: {
                root: false,
            },
            help: null,
        },
    },
    "unassisted:beamer": {
        component: <UnassistedBeamerView />,
        title: "Ungeführter Modus / Beamer",
        options: {
            fullscreen: false,
            navigation: {
                root: false,
            },
            help: null,
        },
    },
    "unassisted:lighting": {
        component: <UnassistedLightingView />,
        title: "Ungeführter Modus / Licht",
        options: {
            fullscreen: false,
            navigation: {
                root: false,
            },
            help: null,
        },
    },
    "help:generic": {
        component: <GenericHelpView />,
        title: "Hilfeseite",
        options: {
            fullscreen: false,
            navigation: {
                root: false,
            },
            help: null,
        },
    },
};

type View = {
    title: string;
    component: React.ReactNode;
    options: {
        fullscreen?: boolean;
        navigation: {
            root: boolean;
        };
        help?: RouterViewKey | null;
    };
};

export function App() {
    const router = useRouter();

    const currentView = views[router.currentView];

    return (
        <>
            <header
                className={cn(
                    "relative h-16 flex-row items-center justify-center px-4 py-2 select-none",
                    currentView.options.fullscreen ? "hidden" : "flex",
                )}>
                {!currentView.options.navigation.root && (
                    <Button className="absolute top-4 left-4" size="icon" variant="ghost" onClick={() => router.pop()}>
                        <ArrowLeft className="size-6" />
                    </Button>
                )}

                <h1 className="text-lg">{currentView.title}</h1>

                <div className="absolute top-4 right-4 flex flex-row items-center gap-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        disabled={currentView.options.help === null}
                        onClick={() => router.push(currentView.options.help ?? "help:generic")}>
                        <CircleQuestionMark className="size-6" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        disabled={router.currentView === "settings"}
                        onClick={() => {
                            router.push("settings");
                        }}>
                        <Cog className="size-6" />
                    </Button>
                </div>
            </header>

            <main
                className={cn(
                    "w-full",
                    currentView.options.fullscreen ? "min-h-dvh" : "min-h-[calc(100dvh-(var(--spacing)*16))]",
                )}>
                {currentView.component}
            </main>
        </>
    );
}
