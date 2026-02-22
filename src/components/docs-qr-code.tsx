import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";

export function DocsQRCode({ className }: { className?: string }) {
    return (
        <QRCodeSVG
            className={cn("aspect-square", className)}
            bgColor="transparent"
            fgColor="currentColor"
            value="https://chfuchte.github.io/aula-assistant"
        />
    );
}
