import { View } from "@/components/view";
import { useRouter } from "@/hooks/router";

export function DefaultView() {
    const router = useRouter();

    return <View className="grid-cols-2 grid-rows-1"></View>;
}
