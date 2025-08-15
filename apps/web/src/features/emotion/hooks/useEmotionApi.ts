import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EmotionService } from '../api/emotionService';
import type {
  CreateEmotionRecordRequest,
  UpdateEmotionRecordRequest,
} from '../api/types';

// Query Keys
export const emotionKeys = {
  all: ['emotion'] as const,
  lists: () => [...emotionKeys.all, 'list'] as const,
  list: (nickname: string, page: number, size: number) =>
    [...emotionKeys.lists(), nickname, page, size] as const,
  details: () => [...emotionKeys.all, 'detail'] as const,
  detail: (id: string) => [...emotionKeys.details(), id] as const,
  chart: ['chart'] as const,
  insight: ['insight'] as const,
  monthly: ['monthly'] as const,
};

// 감정 기록 목록 조회 훅 (페이지네이션)
export const useEmotionList = (nickname: string, page = 0, size = 7) => {
  return useQuery({
    queryKey: emotionKeys.list(nickname || '', page, size),
    queryFn: async () => {
      return await EmotionService.getEmotionList(nickname, page, size);
    },
    enabled: !!nickname && nickname !== '',
    retry: false, // 재시도 비활성화
  });
};

// 감정 기록 생성 - 오디오파일
export const useCreateEmotionRecordSTT = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      nickname,
      request,
    }: {
      nickname: string;
      request: CreateEmotionRecordRequest;
    }) => {
      // FormData를 사용하여 파일과 데이터를 함께 전송
      const formData = new FormData();

      console.log('request', request);
      console.log('audioFile', request.audioFile);
      // 오디오 파일이 있는 경우
      if (request.audioFile) {
        formData.append('audioFile', request.audioFile);
      }

      // 사용자 선택 감정 정보
      if (
        request.userSelectedEmotion &&
        request.userSelectedEmotion.type &&
        request.userSelectedEmotion.percentage
      ) {
        // userSelectedEmotion을 개별 필드로 분리해서 추가
        formData.append(
          'userSelectedEmotion[type]',
          request.userSelectedEmotion.type
        );
        formData.append(
          'userSelectedEmotion[percentage]',
          request.userSelectedEmotion.percentage.toString()
        );
      }

      return EmotionService.createEmotionSTT(nickname, formData);
    },
    onSuccess: () => {
      // 생성된 감정 기록을 캐시에 추가
      queryClient.invalidateQueries({ queryKey: emotionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: emotionKeys.chart });
    },
    onError: error => {
      console.error('감정 기록 생성 실패:', error);
    },
  });
};

// 감정 기록 생성  - 텍스트
export const useCreateEmotionRecordTXT = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      nickname,
      request,
    }: {
      nickname: string;
      request: CreateEmotionRecordRequest;
    }) => {
      return EmotionService.createEmotionTXT(nickname, request);
    },
    onSuccess: () => {
      // 생성된 감정 기록을 캐시에 추가
      queryClient.invalidateQueries({ queryKey: emotionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: emotionKeys.chart });
    },
    onError: error => {
      console.error('감정 기록 생성 실패:', error);
    },
  });
};

// 감정 기록 상세 조회 훅
export const useEmotionDetail = (nickname: string, id: string) => {
  return useQuery({
    queryKey: emotionKeys.detail(id),
    queryFn: () => EmotionService.getEmotionDetail(nickname, id),
    enabled: !!id,
  });
};

// 감정 기록 수정 훅
export const useUpdateEmotionRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      nickname,
      id,
      request,
    }: {
      nickname: string;
      id: string;
      request: UpdateEmotionRecordRequest;
    }) => EmotionService.updateEmotion(nickname, id, request),
    onSuccess: (data, { id }) => {
      // 수정된 감정 기록 캐시 업데이트
      queryClient.setQueryData(emotionKeys.detail(id), data);
      queryClient.invalidateQueries({ queryKey: emotionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: emotionKeys.chart });
    },
    onError: error => {
      console.error('감정 기록 수정 실패:', error);
    },
  });
};

// 감정 기록 삭제 훅
export const useDeleteEmotionRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nickname, id }: { nickname: string; id: string }) =>
      EmotionService.deleteEmotion(nickname, id),
    onSuccess: (_, { id }) => {
      // 삭제된 감정 기록 캐시 제거
      queryClient.removeQueries({ queryKey: emotionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: emotionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: emotionKeys.chart });
    },
    onError: error => {
      console.error('감정 기록 삭제 실패:', error);
    },
  });
};

// 감정 통계 훅
export const useEmotionChart = (nickname: string, month: string) => {
  return useQuery({
    queryKey: emotionKeys.chart,
    queryFn: () => EmotionService.getEmotionChart(nickname, month),
  });
};

export const useEmotionMonthly = (nickname: string, month: string) => {
  return useQuery({
    queryKey: emotionKeys.monthly,
    queryFn: () => EmotionService.getEmotionMonthly(nickname, month),
    enabled: !!month,
  });
};

export const useEmotionInsight = (nickname: string, month: string) => {
  return useQuery({
    queryKey: emotionKeys.insight,
    queryFn: () => EmotionService.getEmotionInsight(nickname, month),
    enabled: !!month,
  });
};
