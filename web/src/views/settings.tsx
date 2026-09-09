import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { View } from "@/components/view";

export function SettingsView() {
    const { setTheme, theme } = useTheme();

    return (
        <View className="flex h-full flex-col items-center justify-between pt-4">
            <div className="mx-auto grid h-fit w-full max-w-[42em] grid-cols-2 grid-rows-1 gap-4">
                <Label htmlFor="theme-switch-btn">Theme</Label>
                <Button id="theme-switch-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    Switch to {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </Button>
            </div>

            <div className="mx-auto flex h-fit w-full max-w-[42em] flex-col items-center gap-1 text-sm text-muted-foreground">
                <span>
                    v{__APP_VERSION__} ({__BUILD_DATE__})
                </span>
                <span>&copy; 2026 Christian Fuchte</span>
            </div>
        </View>
    );
}
