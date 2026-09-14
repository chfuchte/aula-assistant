import { Page } from "@/components/page";
import { View } from "@/components/view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/help/audio/")({
    component: RouteComponent,
    head: () => ({
        meta: [
            {
                title: "ATec Aula Assistant // Hilfe (Audio)",
            },
        ],
    }),
});

function RouteComponent() {
    return (
        <Page title="Hilfe" withBefore help={false} withSettings={false}>
            <View className="block w-full pt-4">
                <section className="typeset mx-auto max-w-[42em]">
                    <h2>Comming soon!</h2>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam illo consectetur sequi odio
                    perferendis itaque pariatur quos expedita ducimus a illum officiis magni, eligendi obcaecati velit
                    qui earum corporis molestiae. Qui, obcaecati eius. Facere, fuga est? Culpa delectus ad, laudantium
                    placeat hic deserunt distinctio, quia tenetur nam architecto, ex quibusdam.
                </section>
            </View>
        </Page>
    );
}
