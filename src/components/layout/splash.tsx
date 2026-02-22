import LogoDarkMode from "@/assets/logo_transparent_dark.png";

export function SplashScreen() {
    return (
        <div className="bg-background grid h-dvh w-dvw place-items-center">
            <img src={LogoDarkMode} className="aspect-square h-1/2 max-h-1/2 w-auto max-w-1/2 object-contain" />
        </div>
    );
}
