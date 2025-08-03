export interface AudioRecorderState {
    isRecording: boolean;
    isPaused: boolean;
    recordingTime: number;
    audioBlob: Blob | null;
    error: string | null;
    realtimeText: string;
    isListening: boolean;
    interimText: string;
}
export interface AudioRecorderControls {
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    pauseRecording: () => void;
    resumeRecording: () => void;
    resetRecording: () => void;
    playRecording: () => Promise<void>;
    updateRealtimeText: (text: string) => void;
}
export declare const useAudioRecorder: () => AudioRecorderState & AudioRecorderControls;
