import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AppState {
  user: {
    id: string;
    name: string;
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
    id: '',
    name: '',
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
      }
    ),
    {
      name: 'app-store',
    }
  )
);
