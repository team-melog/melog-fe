import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
const initialState = {
    entries: [],
    currentEntry: null,
    isRecording: false,
};
export const useEmotionStore = create()(devtools(persist((set, get) => ({
    ...initialState,
    addEntry: (entry) => set((state) => ({
        entries: [
            ...state.entries,
            {
                ...entry,
                id: `emotion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date(),
            },
        ],
    }), false, 'addEntry'),
    updateEntry: (id, updates) => set((state) => ({
        entries: state.entries.map((entry) => entry.id === id ? { ...entry, ...updates } : entry),
    }), false, 'updateEntry'),
    deleteEntry: (id) => set((state) => ({
        entries: state.entries.filter((entry) => entry.id !== id),
    }), false, 'deleteEntry'),
    setCurrentEntry: (currentEntry) => set({ currentEntry }, false, 'setCurrentEntry'),
    setRecording: (isRecording) => set({ isRecording }, false, 'setRecording'),
    getEntriesByDateRange: (startDate, endDate) => {
        const { entries } = get();
        return entries.filter((entry) => entry.timestamp >= startDate && entry.timestamp <= endDate);
    },
}), {
    name: 'melog-emotion-store',
    // Date 객체를 문자열로 변환하여 저장
    storage: {
        getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str)
                return null;
            const { state } = JSON.parse(str);
            return {
                state: {
                    ...state,
                    entries: state.entries?.map((entry) => ({
                        ...entry,
                        timestamp: new Date(entry.timestamp),
                    })) || [],
                },
            };
        },
        setItem: (name, value) => {
            const { state } = value;
            localStorage.setItem(name, JSON.stringify({
                state: {
                    ...state,
                    entries: state.entries?.map((entry) => ({
                        ...entry,
                        timestamp: entry.timestamp.toISOString(),
                    })) || [],
                },
            }));
        },
        removeItem: (name) => localStorage.removeItem(name),
    },
}), {
    name: 'emotion-store',
}));
