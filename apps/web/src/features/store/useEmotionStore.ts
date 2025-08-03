import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type EmotionType = 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'disgust'

export interface EmotionEntry {
  id: string
  emotion: EmotionType
  intensity: number // 1-5 scale
  timestamp: Date
  voiceNote?: string
  photo?: string
  aiAnalysis?: {
    summary: string
    suggestions: string[]
    emotionScore: number
  }
}

interface EmotionState {
  entries: EmotionEntry[]
  currentEntry: Partial<EmotionEntry> | null
  isRecording: boolean
}

interface EmotionActions {
  addEntry: (entry: Omit<EmotionEntry, 'id' | 'timestamp'>) => void
  updateEntry: (id: string, updates: Partial<EmotionEntry>) => void
  deleteEntry: (id: string) => void
  setCurrentEntry: (entry: Partial<EmotionEntry> | null) => void
  setRecording: (isRecording: boolean) => void
  getEntriesByDateRange: (startDate: Date, endDate: Date) => EmotionEntry[]
}

type EmotionStore = EmotionState & EmotionActions

const initialState: EmotionState = {
  entries: [],
  currentEntry: null,
  isRecording: false,
}

export const useEmotionStore = create<EmotionStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      addEntry: (entry) =>
        set(
          (state) => ({
            entries: [
              ...state.entries,
              {
                ...entry,
                id: `emotion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date(),
              },
            ],
          }),
          false,
          'addEntry'
        ),
      updateEntry: (id, updates) =>
        set(
          (state) => ({
            entries: state.entries.map((entry) =>
              entry.id === id ? { ...entry, ...updates } : entry
            ),
          }),
          false,
          'updateEntry'
        ),
      deleteEntry: (id) =>
        set(
          (state) => ({
            entries: state.entries.filter((entry) => entry.id !== id),
          }),
          false,
          'deleteEntry'
        ),
      setCurrentEntry: (currentEntry) =>
        set({ currentEntry }, false, 'setCurrentEntry'),
      setRecording: (isRecording) =>
        set({ isRecording }, false, 'setRecording'),
      getEntriesByDateRange: (startDate, endDate) => {
        const { entries } = get()
        return entries.filter(
          (entry) =>
            entry.timestamp >= startDate && entry.timestamp <= endDate
        )
      },
    }),
    {
      name: 'emotion-store',
    }
  )
)