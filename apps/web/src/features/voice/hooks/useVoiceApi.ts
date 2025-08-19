import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import VoiceService from '../api/voiceService';

// Query Keys
export const voiceKeys = {
  voiceType: ['voiceType'] as const,
  convertedVoice: ['convertedVoice'] as const,
};

// 감정 음성 타입 목록 조회
export const useGetVoiceTypes = () => {
  return useQuery({
    queryKey: voiceKeys.voiceType,
    queryFn: () => VoiceService.getVoiceTypes(),
  });
};

// 감정 음성 파일 요청 (원본 or TTS)
export const useGetConvertedVoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: voiceKeys.convertedVoice,
    mutationFn: ({
      nickname,
      emotionId,
      payload,
    }: {
      nickname: string;
      emotionId: string;
      payload: {
        isUserUploadRequst: boolean;
        isRequiredUserAudio: boolean;
        voiceType?: string | null;
      };
    }) => VoiceService.getConvertedVoice(nickname, emotionId, payload),
    onSuccess: data => {
      queryClient.setQueryData(voiceKeys.convertedVoice, data);
      queryClient.invalidateQueries({ queryKey: voiceKeys.convertedVoice });
    },
  });
};
