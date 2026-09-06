import { GridButton } from "@/components/grid-button";
import { View } from "@/components/view";
import { Power, PowerOff } from "lucide-react";

export function UnassistedBeamerView() {
    return (
        <View className="grid-cols-2 grid-rows-1">
            <GridButton onClick={() => {}}>
                <GridButton.Icon>
                    <Power />
                </GridButton.Icon>
                <GridButton.Label>Einschalten</GridButton.Label>
                <GridButton.Description>Beamer einschalten</GridButton.Description>
            </GridButton>

            <GridButton onClick={() => {}}>
                <GridButton.Icon>
                    <PowerOff />
                </GridButton.Icon>
                <GridButton.Label>Ausschalten</GridButton.Label>
                <GridButton.Description>Beamer ausschalten</GridButton.Description>
            </GridButton>
        </View>
    );
}
