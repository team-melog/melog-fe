import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface AppState {
  user: {
    id: number | null;
    name: string;
    createdAt: string;
    emotionCount: number;
    audioCount: number;
    representativeEmotion: {
      type: string;
      step: number;
    } | null;
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

const initialState: AppState = {
  user: {
    id: null,
    name: '',
    createdAt: '',
    emotionCount: 0,
    audioCount: 0,
    representativeEmotion: null,
  },
  isLoading: false,
  theme: 'light',
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setUser: user =>
          set(
            state => ({
              user: { ...state.user, ...user },
            }),
            false,
            'setUser'
          ),
        setLoading: isLoading => set({ isLoading }, false, 'setLoading'),
        setTheme: theme => set({ theme }, false, 'setTheme'),
        reset: () => set(initialState, false, 'reset'),
      }),
      {
        name: 'app-store',
        partialize: state => ({ user: state.user, theme: state.theme }),
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    {
      name: 'app-store',
    }
  )
);
