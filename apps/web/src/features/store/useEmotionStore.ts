import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type EmotionType =
  | 'joy'
  | 'sadness'
  | 'anger'
  | 'fear'
  | 'surprise'
  | 'disgust';

export interface EmotionEntry {
  id: string;
  emotion: EmotionType;
  intensity: number; // 1-5 scale
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

interface EmotionStore extends EmotionState, EmotionActions {
  recordedAudio: Blob | null;
  transcription: string;
  selectedEmotion: { emotion: string; intensity: number } | null;
  textarea: string; // 사용자가 입력한 텍스트 추가
  analysisResult: unknown | null; // API 분석 결과 저장 (실제 응답 구조가 다를 수 있음)
  setRecordedAudio: (audio: Blob | null) => void;
  setTranscription: (text: string) => void;
  setSelectedEmotion: (
    emotion: { emotion: string; intensity: number } | null
  ) => void;
  setTextarea: (text: string) => void; // 텍스트 설정 액션 추가
  setAnalysisResult: (result: unknown) => void; // 분석 결과 설정 액션 추가
  clearRecording: () => void;
}

const initialState: EmotionState = {
  entries: [],
  currentEntry: null,
  isRecording: false,
};

export const useEmotionStore = create<EmotionStore>()(
  persist(
    devtools(
      (set, get) => ({
        ...initialState,
        addEntry: entry =>
          set(
            state => ({
              entries: [
                ...state.entries,
                {
                  ...entry,
                  id: `emotion_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                  timestamp: new Date(),
                },
              ],
            }),
            false,
            'addEntry'
          ),
        updateEntry: (id, updates) =>
          set(
            state => ({
              entries: state.entries.map(entry =>
                entry.id === id ? { ...entry, ...updates } : entry
              ),
            }),
            false,
            'updateEntry'
          ),
        deleteEntry: id =>
          set(
            state => ({
              entries: state.entries.filter(entry => entry.id !== id),
            }),
            false,
            'deleteEntry'
          ),
        setCurrentEntry: currentEntry =>
          set({ currentEntry }, false, 'setCurrentEntry'),
        setRecording: isRecording =>
          set({ isRecording }, false, 'setRecording'),
        getEntriesByDateRange: (startDate, endDate) => {
          const { entries } = get();
          return entries.filter(
            entry => entry.timestamp >= startDate && entry.timestamp <= endDate
          );
        },
        recordedAudio: null,
        transcription: '',
        selectedEmotion: null,
        textarea: '', // 초기 사용자 텍스트 상태 추가
        analysisResult: null, // 초기 분석 결과 상태
        setRecordedAudio: audio => set({ recordedAudio: audio }),
        setTranscription: text => set({ transcription: text }),
        setSelectedEmotion: emotion => set({ selectedEmotion: emotion }),
        setTextarea: text => set({ textarea: text }), // 사용자 텍스트 설정 액션 추가
        setAnalysisResult: result => set({ analysisResult: result }), // 분석 결과 설정 액션 추가
        clearRecording: () =>
          set({
            // recordedAudio: null,
            transcription: '',
            // selectedEmotion: null,
            // textarea: '',
            // analysisResult: null,
          }),
      }),
      {
        name: 'emotion-store',
      }
    ),
    {
      name: 'emotion-storage', // 로컬 스토리지에 저장될 키 이름
      partialize: state => ({
        // Blob은 직렬화할 수 없으므로 제외
        entries: state.entries,
        currentEntry: state.currentEntry,
        transcription: state.transcription,
        selectedEmotion: state.selectedEmotion,
        textarea: state.textarea,
        analysisResult: state.analysisResult,
      }),
    }
  )
);
