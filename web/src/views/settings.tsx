import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { View } from "@/components/view";

export function SettingsView() {
    const { setTheme, theme } = useTheme();

    return (
        <View className="grid-cols-1 grid-rows-1">
            <div className="mx-auto grid h-fit w-full max-w-[42em] grid-cols-2 grid-rows-1 gap-4">
                <Label htmlFor="theme-switch-btn">Theme</Label>
                <Button id="theme-switch-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    Switch to {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </Button>
            </div>
        </View>
    );
}
