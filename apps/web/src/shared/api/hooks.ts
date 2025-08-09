import { useState, useCallback } from 'react';
import type { ApiResponse } from './types';

// API 호출 상태를 관리하는 훅
export function useApiCall<T = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (apiCall: () => Promise<ApiResponse<T>>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall();

        if (response.success && response.data) {
          setData(response.data);
          return response;
        } else {
          const errorMessage =
            response.error || response.message || 'API 호출 실패';
          setError(errorMessage);
          throw new Error(errorMessage);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// 무한 스크롤을 위한 훅
export function useInfiniteApiCall<T = unknown>() {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMore = useCallback(
    async (apiCall: (page: number) => Promise<ApiResponse<T[]>>) => {
      if (loading || !hasMore) return;

      setLoading(true);
      setError(null);

      try {
        const response = await apiCall(page);

        if (response.success && response.data) {
          if (page === 1) {
            setData(response.data);
          } else {
            setData(prev => [...prev, ...response.data!]);
          }

          // 데이터가 페이지 크기보다 작으면 더 이상 데이터가 없다고 판단
          if (response.data.length < 10) {
            // 기본 페이지 크기
            setHasMore(false);
          }

          setPage(prev => prev + 1);
          return response;
        } else {
          const errorMessage =
            response.error || response.message || 'API 호출 실패';
          setError(errorMessage);
          throw new Error(errorMessage);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, page]
  );

  const reset = useCallback(() => {
    setData([]);
    setError(null);
    setLoading(false);
    setHasMore(true);
    setPage(1);
  }, []);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
  };
}
