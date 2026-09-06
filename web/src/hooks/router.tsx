import { createContext, useContext, useState } from "react";

export type RouterViewKey =
    | "root:splashscreen"
    | "root:default"
    | "settings"
    // unassisted mode
    | "unassisted:default"
    | "unassisted:audio"
    | "unassisted:beamer"
    | "unassisted:lighting"
    // help pages
    | "help:generic";

interface Router {
    currentView: RouterViewKey;
    history: Set<RouterViewKey>;
    navigate: (view: RouterViewKey) => void;
    push: (view: RouterViewKey) => void;
    pop: () => void;
}

const RouterContext = createContext<Router | undefined>(undefined);

interface RouterState {
    currentView: RouterViewKey;
    history: Set<RouterViewKey>;
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<RouterState>({
        currentView: "root:default",
        history: new Set(),
    });

    const navigate = (view: RouterViewKey) => {
        setState((prev) => ({
            currentView: view,
            history: prev.history,
        }));
    };

    const push = (view: RouterViewKey) => {
        setState((prev) => ({
            currentView: view,
            history: new Set([...prev.history, prev.currentView]),
        }));
    };

    const pop = () => {
        setState((prev) => {
            const historyArray = Array.from(prev.history);
            const lastView = historyArray[historyArray.length - 1] || "root:default";
            const newHistory = new Set(historyArray.slice(0, -1));
            return {
                currentView: lastView,
                history: newHistory,
            };
        });
    };

    return (
        <RouterContext.Provider
            value={{
                currentView: state.currentView,
                history: state.history,
                push,
                pop,
                navigate,
            }}>
            {children}
        </RouterContext.Provider>
    );
}

export function useRouter() {
    const context = useContext(RouterContext);
    if (!context) {
        throw new Error("useRouter must be used within a RouterProvider");
    }
    return context;
}
