export type ConvertedVoiceType = {
  audioAvailable: boolean;
  audioUrl: string;
  duration: number | null;
  fileName: string;
  fileSize: number;
  fileSizeInMB?: number;
  isFromUserUpload: boolean;
  mimeType: string;
  ttsGenerated: boolean;
  voiceType: string | null;
};

export interface VoiceType {
  name: string; // "ARA", "MIKYUNG", "DAIN" 등
  voiceKey: string; // "vara", "vmikyung", "vdain" 등
  voiceName: string; // "아라", "미경", "다인" 등
}
export type VoiceTypeResponse = VoiceType[];
