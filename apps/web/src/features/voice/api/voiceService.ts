import { apiClient } from '../../../shared/api';
import { API_ENDPOINTS } from '../../../shared/api/config';
import { ConvertedVoiceType, VoiceTypeResponse } from './types';

// 감정 음성타입 목록 조회
export class VoiceService {
  static async getVoiceTypes() {
    const res = apiClient.get<VoiceTypeResponse>(
      `${API_ENDPOINTS.VOICE.VOICE_TYPES}`
    );
    return res;
  }

  // 감정 음성파일 요청 (원본 or TTS)
  static async getConvertedVoice(
    nickname: string,
    emotionId: string,
    payload: {
      isUserUploadRequst: boolean;
      isRequiredUserAudio: boolean;
      voiceType?: string | null;
    }
  ) {
    const url = API_ENDPOINTS.VOICE.EMOTION_AUDIO.replace(
      ':nickname',
      nickname
    ).replace(':id', emotionId);
    const res = apiClient.post<ConvertedVoiceType>(url, payload);
    return res;
  }
}

export default VoiceService;
