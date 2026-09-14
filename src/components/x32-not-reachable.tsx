import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { View } from "./view";

export function X32NotReachableVirtualPage({ onOk }: { onOk: () => void }) {
    return (
        <View className="grid place-items-center">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia>
                        <AlertTriangle />
                    </EmptyMedia>
                    <EmptyTitle>Mischpult nicht erreichbar</EmptyTitle>
                    <EmptyDescription>
                        Bitte gehe die unten stehende Checkliste durch und versuche es erneut.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <div className="typeset text-start">
                        <ol>
                            <li>Ist der Hauptschalter eingeschaltet?</li>
                            <li>Ist der Schalter an der Rückseite des Mischpultes auf an gestellt?</li>
                            <li>Steckt das Netzwerkkabel an der Rückseite vom Mischpult?</li>
                        </ol>
                        <p>Falls das Problem weiterhin besteht, kontaktiere bitte die Technik AG.</p>
                    </div>
                    <Button onClick={onOk}>Verstanden</Button>
                </EmptyContent>
            </Empty>
        </View>
    );
}
