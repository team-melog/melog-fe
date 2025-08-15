import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
const initialState = {
    user: {
        id: null,
        name: null,
    },
    isLoading: false,
    theme: 'light',
};
export const useAppStore = create()(devtools(persist(set => ({
    ...initialState,
    setUser: user => set(state => ({
        user: { ...state.user, ...user },
    }), false, 'setUser'),
    setLoading: isLoading => set({ isLoading }, false, 'setLoading'),
    setTheme: theme => set({ theme: theme }, false, 'setTheme'),
    reset: () => set(initialState, false, 'reset'),
}), {
    name: 'melog-app-store',
    // localStorage에 저장할 상태들
    partialize: state => ({
        theme: state.theme,
        user: state.user,
    }),
}), {
    name: 'app-store',
}));
