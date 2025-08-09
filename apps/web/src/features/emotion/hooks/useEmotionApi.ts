import { useCallback } from 'react';
// import { useApiCall, useInfiniteApiCall } from '../../../shared/api';
import { useApiCall } from '../../../shared/api';
import { EmotionService } from '../api/emotionService';
import type {
  EmotionRecord,
  EmotionAnalysisRequest,
  EmotionAnalysisResult,
  CreateEmotionRecordRequest,
  UpdateEmotionRecordRequest,
  EmotionStats,
} from '../api/types';

// 감정 분석 훅
export function useEmotionAnalysis() {
  const { data, loading, error, execute, reset } =
    useApiCall<EmotionAnalysisResult>();

  const analyzeEmotion = useCallback(
    (request: EmotionAnalysisRequest) => {
      return execute(() => EmotionService.analyzeEmotion(request));
    },
    [execute]
  );

  return {
    result: data,
    loading,
    error,
    analyzeEmotion,
    reset,
  };
}

// 감정 기록 생성 훅
export function useCreateEmotionRecord() {
  const { data, loading, error, execute, reset } = useApiCall<EmotionRecord>();

  const createRecord = useCallback(
    (request: CreateEmotionRecordRequest) => {
      return execute(() => EmotionService.createEmotionRecord(request));
    },
    [execute]
  );

  return {
    record: data,
    loading,
    error,
    createRecord,
    reset,
  };
}

// 감정 기록 조회 훅 (무한 스크롤)
export function useEmotionRecords() {
  // const { data, loading, error, hasMore, loadMore, reset } =
  //   useInfiniteApiCall<EmotionRecord>();
  // const fetchRecords = useCallback(
  //   (page: number) => {
  //     return loadMore(page => EmotionService.getEmotionRecords(page, 10));
  //   },
  //   [loadMore]
  // );
  // return {
  //   records: data,
  //   loading,
  //   error,
  //   hasMore,
  //   fetchRecords,
  //   reset,
  // };
}

// 감정 기록 상세 조회 훅
export function useEmotionRecord(id: string) {
  const { data, loading, error, execute, reset } = useApiCall<EmotionRecord>();

  const fetchRecord = useCallback(() => {
    if (!id) return;
    return execute(() => EmotionService.getEmotionRecord(id));
  }, [id, execute]);

  return {
    record: data,
    loading,
    error,
    fetchRecord,
    reset,
  };
}

// 감정 기록 수정 훅
export function useUpdateEmotionRecord() {
  const { data, loading, error, execute, reset } = useApiCall<EmotionRecord>();

  const updateRecord = useCallback(
    (id: string, request: UpdateEmotionRecordRequest) => {
      return execute(() => EmotionService.updateEmotionRecord(id, request));
    },
    [execute]
  );

  return {
    record: data,
    loading,
    error,
    updateRecord,
    reset,
  };
}

// 감정 기록 삭제 훅
export function useDeleteEmotionRecord() {
  const { data, loading, error, execute, reset } = useApiCall<EmotionRecord>();

  const deleteRecord = useCallback(
    (id: string) => {
      return execute(() => EmotionService.deleteEmotionRecord(id));
    },
    [execute]
  );

  return {
    record: data,
    loading,
    error,
    deleteRecord,
    reset,
  };
}

// 감정 통계 훅
export function useEmotionStats() {
  const { data, loading, error, execute, reset } = useApiCall<EmotionStats>();

  const fetchStats = useCallback(() => {
    return execute(() => EmotionService.getEmotionStats());
  }, [execute]);

  return {
    stats: data,
    loading,
    error,
    fetchStats,
    reset,
  };
}
