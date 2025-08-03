import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
const initialState = {
    user: {
        id: null,
        name: null,
        email: null,
    },
    isLoading: false,
    theme: 'light',
};
export const useAppStore = create()(devtools(persist((set) => ({
    ...initialState,
    setUser: (user) => set((state) => ({
        user: { ...state.user, ...user },
    }), false, 'setUser'),
    setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),
    setTheme: (theme) => set({ theme }, false, 'setTheme'),
    reset: () => set(initialState, false, 'reset'),
}), {
    name: 'melog-app-store',
    // 민감한 정보는 저장하지 않음
    partialize: (state) => ({
        theme: state.theme,
        // user 정보는 보안상 localStorage에 저장하지 않음
    }),
}), {
    name: 'app-store',
}));
