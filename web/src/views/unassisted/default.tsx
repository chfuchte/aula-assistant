import { GridButton } from "@/components/grid-button";
import { View } from "@/components/view";
import { useRouter } from "@/hooks/router";
import { Lightbulb, Lock, Music, Projector } from "lucide-react";

export function UnassistedDefaultView() {
    const router = useRouter();

    return (
        <View className="grid-cols-2 grid-rows-2">
            <GridButton onClick={() => router.push("unassisted:audio")}>
                <GridButton.Icon>
                    <Music />
                </GridButton.Icon>
                <GridButton.Label>Ton</GridButton.Label>
                <GridButton.Description>lorem ipsum</GridButton.Description>
            </GridButton>

            <GridButton onClick={() => router.push("unassisted:beamer")}>
                <GridButton.Icon>
                    <Projector />
                </GridButton.Icon>
                <GridButton.Label>Beamer</GridButton.Label>
                <GridButton.Description>lorem ipsum</GridButton.Description>
            </GridButton>

            <GridButton onClick={() => router.push("unassisted:lighting")}>
                <GridButton.Icon>
                    <Lightbulb />
                </GridButton.Icon>
                <GridButton.Label>Licht</GridButton.Label>
                <GridButton.Description>lorem ipsum</GridButton.Description>
            </GridButton>

            <GridButton disabled onClick={() => router.push("help:generic")}>
                <GridButton.Icon>
                    <Lock />
                </GridButton.Icon>
                <GridButton.Label>Coming soon</GridButton.Label>
                <GridButton.Description></GridButton.Description>
            </GridButton>
        </View>
    );
}
