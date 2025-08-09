import type { ApiResponse } from '../../../shared/api';

// 감정 기록 타입
export interface NicknameRecord {
  nickname: string;
  createdAt: string;
}

// API 응답 타입들
export type NicknameRecordResponse = ApiResponse<NicknameRecord>;
