import { GridButton } from "@/components/grid-button";
import { Spinner } from "@/components/ui/spinner";
import { View } from "@/components/view";
import { postBeamerOff, postBeamerOn } from "@/lib/queries/beamer";
import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import { Power } from "lucide-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/styles/global.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppWithProviders />
    </StrictMode>,
);

function AppWithProviders() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <main className="min-h-dvh w-full *:gap-8! *:p-8!">
                <UnassistedBeamerView />
            </main>
        </QueryClientProvider>
    );
}

function UnassistedBeamerView() {
    const beamerOnMutation = useMutation({
        mutationFn: postBeamerOn,
        onError: (error) => {
            console.error("Error turning on the beamer:", error);
        },
    });

    const beamerOffMutation = useMutation({
        mutationFn: postBeamerOff,
        onError: (error) => {
            console.error("Error turning off the beamer:", error);
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
