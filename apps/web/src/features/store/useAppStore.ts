import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface AppState {
  user: {
    id: string | null
    name: string | null
    email: string | null
  }
  isLoading: boolean
  theme: 'light' | 'dark'
}

interface AppActions {
  setUser: (user: Partial<AppState['user']>) => void
  setLoading: (loading: boolean) => void
  setTheme: (theme: AppState['theme']) => void
  reset: () => void
}

type AppStore = AppState & AppActions

const initialState: AppState = {
  user: {
    id: null,
    name: null,
    email: null,
  },
  isLoading: false,
  theme: 'light',
}

export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      ...initialState,
      setUser: (user) =>
        set(
          (state) => ({
            user: { ...state.user, ...user },
          }),
          false,
          'setUser'
        ),
      setLoading: (isLoading) =>
        set({ isLoading }, false, 'setLoading'),
      setTheme: (theme) =>
        set({ theme }, false, 'setTheme'),
      reset: () =>
        set(initialState, false, 'reset'),
    }),
    {
      name: 'app-store',
    }
  )
)