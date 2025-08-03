interface AppState {
    user: {
        id: string | null;
        name: string | null;
        email: string | null;
    };
    isLoading: boolean;
    theme: 'light' | 'dark';
}
interface AppActions {
    setUser: (user: Partial<AppState['user']>) => void;
    setLoading: (loading: boolean) => void;
    setTheme: (theme: AppState['theme']) => void;
    reset: () => void;
}
type AppStore = AppState & AppActions;
export declare const useAppStore: import("zustand").UseBoundStore<Omit<Omit<import("zustand").StoreApi<AppStore>, "setState"> & {
    setState<A extends string | {
        type: string;
    }>(partial: AppStore | Partial<AppStore> | ((state: AppStore) => AppStore | Partial<AppStore>), replace?: boolean | undefined, action?: A | undefined): void;
}, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<AppStore, {
            theme: "light" | "dark";
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AppStore) => void) => () => void;
        onFinishHydration: (fn: (state: AppStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<AppStore, {
            theme: "light" | "dark";
        }>>;
    };
}>;
export {};
