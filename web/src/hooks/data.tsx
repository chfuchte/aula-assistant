import { getLightingScenesQueryOptions } from "@/lib/queries/lighting";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect } from "react";
import { useRouter } from "./router";

interface Data {
    lightingScenes: string[];
}

const DataContext = createContext<Data | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const { data, error, isError, isLoading, isSuccess, isRefetching } = useQuery(getLightingScenesQueryOptions);

    useEffect(() => {
        if (isError) {
            console.error("DataProvider: Query failed", error);
            router.clearHistory();
            router.navigate("error:fatal");
            return;
        }

        if (isLoading || isRefetching) {
            router.navigate("root:splashscreen");
            return;
        }

        if (isSuccess) {
            router.navigate("root:default");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError, isLoading, isSuccess, error, isRefetching]);

    return (
        <DataContext.Provider
            value={{
                lightingScenes: data?.scenes || [],
            }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
}
