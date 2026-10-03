import { Page } from "@/components/page";
import { View } from "@/components/view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/help/lighting/")({
    component: RouteComponent,
    head: () => ({
        meta: [
            {
                title: "ATec Aula Assistant // Hilfe (Beleuchtung)",
            },
        ],
    }),
});

function RouteComponent() {
    return (
        <Page title="Hilfe" withBefore help={false} withSettings={false}>
            <View className="block w-full pt-4">
                <section className="typeset mx-auto max-w-[42em]">
                    <h2>Beleuchtung</h2>
                </section>
            </View>
        </Page>
    );
}
