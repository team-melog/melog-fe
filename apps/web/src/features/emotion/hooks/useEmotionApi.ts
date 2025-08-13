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
  stats: () => [...emotionKeys.all, 'stats'] as const,
  monthly: ['monthly'] as const,
};

// 감정 기록 목록 조회 훅 (페이지네이션)
export const useEmotionList = (
  nickname: string | undefined,
  page = 0,
  size = 7
) => {
  return useQuery({
    queryKey: emotionKeys.list(nickname || '', page, size),
    queryFn: async () => {
      try {
        return await EmotionService.getEmotionList(nickname || '', page, size);
      } catch (error) {
        console.error(error);
        // 테스트용
        const testData = {
          content: [
            {
              id: 21,
              date: '2025-08-06',
              summary: '지침과 분노가 반복됨',
              emotions: [
                { type: '지침', percentage: 40, step: 2 },
                { type: '분노', percentage: 35, step: 2 },
                { type: '불안', percentage: 25, step: 2 },
              ],
            },
            {
              id: 20,
              date: '2025-08-05',
              summary: '매우 긍정적인 변화가 나타남',
              emotions: [
                { type: '기쁨', percentage: 70, step: 4 },
                { type: '설렘', percentage: 20, step: 1 },
                { type: '여유', percentage: 10, step: 1 },
              ],
            },
          ],
          page: 0,
          size: 7,
        };
        return testData;
      }
    },
    // enabled: !!nickname && nickname !== '',
    retry: false, // 재시도 비활성화
  });
};

// 감정 분석 훅
export const useEmotionAnalysis = () => {
  // const queryClient = useQueryClient();
  // return useMutation({
  //   mutationFn: (request: EmotionAnalysisRequest) =>
  //     EmotionService.analyzeEmotion(request),
  //   onSuccess: () => {
  //     // 감정 분석 성공 시 관련 캐시 무효화
  //     queryClient.invalidateQueries({ queryKey: emotionKeys.stats() });
  //   },
  //   onError: error => {
  //     console.error('감정 분석 실패:', error);
  //   },
  // });
};

// 감정 기록 생성 훅
export const useCreateEmotionRecord = () => {
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
      // 오디오 파일이 있는 경우
      if (request.audioFile) {
        formData.append('audioFile', request.audioFile);
      }

      // 텍스트가 있는 경우
      if (request.text) {
        formData.append('text', request.text);
      }

      // 사용자 선택 감정 정보
      if (request.userSelectedEmotion && request.userSelectedEmotion.type) {
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

      return EmotionService.createEmotion(nickname, request, formData);
    },
    onSuccess: () => {
      // 생성된 감정 기록을 캐시에 추가
      queryClient.invalidateQueries({ queryKey: emotionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: emotionKeys.stats() });
    },
    onError: error => {
      console.error('감정 기록 생성 실패:', error);
    },
  });
};

// 감정 기록 상세 조회 훅
export const useEmotionRecord = (id: string) => {
  return useQuery({
    queryKey: emotionKeys.detail(id),
    queryFn: () => EmotionService.getEmotionDetail(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh로 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};

// 감정 기록 수정 훅
export const useUpdateEmotionRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: UpdateEmotionRecordRequest;
    }) => EmotionService.updateEmotion(id, request),
    onSuccess: (data, { id }) => {
      // 수정된 감정 기록 캐시 업데이트
      queryClient.setQueryData(emotionKeys.detail(id), data);
      queryClient.invalidateQueries({ queryKey: emotionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: emotionKeys.stats() });
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
    mutationFn: (id: string) => EmotionService.deleteEmotion(id),
    onSuccess: (_, id) => {
      // 삭제된 감정 기록 캐시 제거
      queryClient.removeQueries({ queryKey: emotionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: emotionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: emotionKeys.stats() });
    },
    onError: error => {
      console.error('감정 기록 삭제 실패:', error);
    },
  });
};

// 감정 통계 훅
export const useEmotionStats = () => {
  return useQuery({
    queryKey: emotionKeys.stats(),
    queryFn: () => EmotionService.getEmotionStats(),
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh로 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};

export const useEmotionMonthly = (nickname: string, month: string) => {
  return useQuery({
    queryKey: emotionKeys.monthly,
    queryFn: () => EmotionService.getEmotionMonthly(nickname, month),
    enabled: !!month,
  });
};
