export type EmotionVoice = {
  audioUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  isFromUserUpload: boolean;
  voiceType: string;
  duration: number | null;
};

export interface VoiceType {
  name: string; // "ARA", "MIKYUNG", "DAIN" 등
  voiceKey: string; // "vara", "vmikyung", "vdain" 등
  voiceName: string; // "아라", "미경", "다인" 등
}
export type VoiceTypeResponse = VoiceType[];
