import { Page } from "@/components/router/page";
import { View } from "@/components/router/view";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { logger } from "@/utils/logger";
import { useQueryClient } from "@tanstack/react-query";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";

export function ErrorComponent({ reset, error }: ErrorComponentProps) {
    const router = useRouter();
    const queryClient = useQueryClient();

    logger("error-component")("error", JSON.stringify(error, null, 2));

    return (
        <Page fullscreen>
            <View className="grid w-full place-items-center">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia>
                            <AlertCircle />
                        </EmptyMedia>
                        <EmptyTitle>Unexpected Error</EmptyTitle>
                        <EmptyDescription>
                            Ein fataler Fehler ist aufgetreten. Dies könnte auf ein Problem mit der Anwendung, der
                            Konfiguration oder Netzwerkproblemen hindeuten. <br />
                            Bitte versuche es erneut oder kontaktiere die Technik AG, wenn das Problem weiterhin
                            bestehen bleibt.
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
