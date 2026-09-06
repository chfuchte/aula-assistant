import { GridButton } from "@/components/grid-button";
import { Spinner } from "@/components/ui/spinner";
import { View } from "@/components/view";
import { useRouter } from "@/hooks/router";
import { postBeamerOff, postBeamerOn } from "@/lib/queries/beamer";
import { useMutation } from "@tanstack/react-query";
import { Power } from "lucide-react";

export function UnassistedBeamerView() {
    const router = useRouter();

    const beamerOnMutation = useMutation({
        mutationFn: postBeamerOn,
        onError: (error) => {
            console.error("Error turning on the beamer:", error);
            router.clearHistory();
            router.navigate("error:fatal");
        },
    });

    const beamerOffMutation = useMutation({
        mutationFn: postBeamerOff,
        onError: (error) => {
            console.error("Error turning off the beamer:", error);
            router.clearHistory();
            router.navigate("error:fatal");
        },
    });

    return (
        <View className="grid-cols-2 grid-rows-1">
            <GridButton
                disabled={beamerOnMutation.isPending || beamerOffMutation.isPending}
                onClick={() => beamerOnMutation.mutate()}>
                <GridButton.Icon>{beamerOnMutation.isPending ? <Spinner /> : <Power />}</GridButton.Icon>
                <GridButton.Label>Einschalten</GridButton.Label>
                <GridButton.Description>Beamer einschalten</GridButton.Description>
            </GridButton>

            <GridButton
                disabled={beamerOnMutation.isPending || beamerOffMutation.isPending}
                onClick={() => beamerOffMutation.mutate()}>
                <GridButton.Icon>{beamerOffMutation.isPending ? <Spinner /> : <Power />}</GridButton.Icon>
                <GridButton.Label>Ausschalten</GridButton.Label>
                <GridButton.Description>Beamer ausschalten</GridButton.Description>
            </GridButton>
        </View>
    );
}
