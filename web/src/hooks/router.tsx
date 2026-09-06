import { createContext, useContext, useState } from "react";

export type RouterViewKey =
    | "root:splashscreen"
    | "root:default"
    | "settings"
    | "help:generic";

interface Router {
    currentView: RouterViewKey;
    history: RouterViewKey[];
    navigate: (view: RouterViewKey) => void;
    push: (view: RouterViewKey) => void;
    pop: () => void;
}

const RouterContext = createContext<Router | undefined>(undefined);

interface RouterState {
    currentView: RouterViewKey;
    history: RouterViewKey[];
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<RouterState>({
        currentView: "root:default",
        history: [],
    });

    const navigate = (view: RouterViewKey) => {
        setState((prev) => ({
            ...prev,
            currentView: view,
        }));
    };

    const push = (view: RouterViewKey) => {
        setState((prev) => ({
            currentView: view,
            history: [...prev.history, prev.currentView],
        }));
    };

    const pop = () => {
        setState((prev) => {
            if (prev.history.length === 0) {
                return prev;
            }

            const history = [...prev.history];
            const currentView = history.pop()!;

            return {
                currentView,
                history,
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
