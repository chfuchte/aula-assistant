import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { View } from "./view";

export function NetworkErrorVirtualPage({ onOk }: { onOk: () => void }) {
    return (
        <View className="grid place-items-center">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia>
                        <AlertTriangle />
                    </EmptyMedia>
                    <EmptyTitle>Netzwerkfehler</EmptyTitle>
                    <EmptyDescription>
                        Bitte versuche es erneut. Falls das Problem weiterhin besteht, kontaktiere bitte die Technik AG.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button onClick={onOk}>Verstanden</Button>
                </EmptyContent>
            </Empty>
        </View>
    );
}
