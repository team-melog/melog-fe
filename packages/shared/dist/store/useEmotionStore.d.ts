import type { EmotionType } from '../entities/emotion';
export interface EmotionEntry {
    id: string;
    emotion: EmotionType;
    intensity: number;
    timestamp: Date;
    voiceNote?: string;
    photo?: string;
    aiAnalysis?: {
        summary: string;
        suggestions: string[];
        emotionScore: number;
    };
}
interface EmotionState {
    entries: EmotionEntry[];
    currentEntry: Partial<EmotionEntry> | null;
    isRecording: boolean;
}
interface EmotionActions {
    addEntry: (entry: Omit<EmotionEntry, 'id' | 'timestamp'>) => void;
    updateEntry: (id: string, updates: Partial<EmotionEntry>) => void;
    deleteEntry: (id: string) => void;
    setCurrentEntry: (entry: Partial<EmotionEntry> | null) => void;
    setRecording: (isRecording: boolean) => void;
    getEntriesByDateRange: (startDate: Date, endDate: Date) => EmotionEntry[];
}
type EmotionStore = EmotionState & EmotionActions;
export declare const useEmotionStore: import("zustand").UseBoundStore<Omit<Omit<import("zustand").StoreApi<EmotionStore>, "setState"> & {
    setState<A extends string | {
        type: string;
    }>(partial: EmotionStore | Partial<EmotionStore> | ((state: EmotionStore) => EmotionStore | Partial<EmotionStore>), replace?: boolean | undefined, action?: A | undefined): void;
}, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<EmotionStore, any>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: EmotionStore) => void) => () => void;
        onFinishHydration: (fn: (state: EmotionStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<EmotionStore, any>>;
    };
}>;
export {};
