import { View } from "@/components/view";

import LogoDarkMode from "@/assets/logo_transparent_dark.png";

export function SplashScreen() {
    return (
        <View className="@container relative h-dvh w-full bg-background select-none">
            <img
                src={LogoDarkMode}
                className="absolute inset-0 top-0 left-0 m-auto aspect-square h-1/2 max-h-[50cqh] w-auto max-w-[50cqw] object-contain"
            />
            <div className="absolute bottom-12 flex w-full flex-row items-center justify-center gap-2 p-8">
                <span className="text-lg text-muted-foreground">Interface wird vorbereitet...</span>
            </div>
        </View>
    );
}
