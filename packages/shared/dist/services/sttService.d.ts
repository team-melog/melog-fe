export interface STTResponse {
    success: boolean;
    text: string;
    confidence?: number;
    error?: string;
}
export interface STTConfig {
    apiUrl?: string;
    apiKey?: string;
    language?: string;
    maxRetries?: number;
}
export declare const convertSpeechToText: (audioBlob: Blob, config?: Partial<STTConfig>) => Promise<STTResponse>;
export declare const convertSpeechToTextFallback: (audioBlob: Blob) => Promise<STTResponse>;
export declare const convertSpeechToTextWithRetry: (audioBlob: Blob, config?: Partial<STTConfig>) => Promise<STTResponse>;
