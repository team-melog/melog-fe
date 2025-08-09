import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import UserService from '../api/userService';
import { QUERY_KEYS } from '@/shared';

// Query Keys
export const userKeys = {
  all: ['user'] as const,
  nickname: (nickname: string) =>
    [...userKeys.all, 'nickname', nickname] as const,
  nicknames: () => [...userKeys.all, 'nicknames'] as const,
};

// 닉네임 조회 훅
export const useGetNickname = (nickname: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.NICKNAME],
    queryFn: () => UserService.getNickname(nickname),
    enabled: !!nickname, // nickname이 있을 때만 쿼리 실행
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};

// 닉네임 생성 훅
export const useCreateNickname = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.NICKNAME],
    mutationFn: (nickname: string) => UserService.createNickname(nickname),
    onSuccess: (data, nickname) => {
      //   console.log('data', data, nickname);
      queryClient.setQueryData(userKeys.nickname(nickname), data);
      queryClient.invalidateQueries({ queryKey: userKeys.nicknames() });
    },
    onError: error => {
      console.error('닉네임 생성 실패:', error);
      // 테스트용
      const testData = {
        nickname: 'angrybird',
        createdAt: '2025-08-07T14:33:00',
      };
      queryClient.setQueryData(userKeys.nickname(testData.nickname), testData);
      queryClient.invalidateQueries({ queryKey: userKeys.nicknames() });
    },
  });
};

// 닉네임 수정 훅
export const useUpdateNickname = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.NICKNAME],
    mutationFn: (request: { nickname: string; newNickname: string }) =>
      UserService.updateNicknameRecord(request),
    onSuccess: (data, request) => {
      // 기존 닉네임 캐시 제거
      queryClient.removeQueries({
        queryKey: userKeys.nickname(request.nickname),
      });
      // 새 닉네임으로 캐시 설정
      queryClient.setQueryData(userKeys.nickname(request.newNickname), data);
      // 닉네임 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: userKeys.nicknames() });
    },
    onError: error => {
      console.error('닉네임 수정 실패:', error);
    },
  });
};

// 닉네임 삭제 훅
export const useDeleteNickname = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.NICKNAME],
    mutationFn: (nickname: string) =>
      UserService.deleteNicknameRecord(nickname),
    onSuccess: (_, nickname) => {
      // 삭제된 닉네임 캐시 제거
      queryClient.removeQueries({ queryKey: userKeys.nickname(nickname) });
      // 닉네임 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: userKeys.nicknames() });
    },
    onError: error => {
      console.error('닉네임 삭제 실패:', error);
    },
  });
};
