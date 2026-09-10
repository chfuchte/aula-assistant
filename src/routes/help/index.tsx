import { Page } from "@/components/router/page";
import { View } from "@/components/router/view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/help/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <Page title="Hilfe" withBefore help={false} withSettings={false}>
            <View className="block w-full pt-4">
                <section className="typeset mx-auto max-w-[42em]">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam illo consectetur sequi odio
                    perferendis itaque pariatur quos expedita ducimus a illum officiis magni, eligendi obcaecati velit
                    qui earum corporis molestiae. Qui, obcaecati eius. Facere, fuga est? Culpa delectus ad, laudantium
                    placeat hic deserunt distinctio, quia tenetur nam architecto, ex quibusdam.
                </section>
            </View>
        </Page>
    );
}
