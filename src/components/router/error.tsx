import { Page } from "@/components/page";
import { View } from "@/components/view";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useQueryClient } from "@tanstack/react-query";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";

export function ErrorComponent({ reset, error }: ErrorComponentProps) {
    const router = useRouter();
    const queryClient = useQueryClient();

    console.error("ErrorComponent caught an error:", error);

    return (
        <Page fullscreen>
            <View className="grid w-full place-items-center">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia>
                            <AlertCircle />
                        </EmptyMedia>
                        <EmptyTitle>Ein unerwarteter Fehler ist aufgetreten</EmptyTitle>
                        <EmptyDescription>
                            Bitte versuche es erneut oder kontaktiere die Technik AG, wenn das Problem bestehen bleibt.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button
                            onClick={() => {
                                router.navigate({ to: "/" });
                                queryClient.invalidateQueries({
                                    type: "all",
                                    refetchType: "all",
                                });
                                reset();
                            }}>
                            Erneut versuchen
                        </Button>
                    </EmptyContent>
                </Empty>
            </View>
        </Page>
    );
}
