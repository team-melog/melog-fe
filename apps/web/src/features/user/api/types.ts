import type { ApiResponse } from '../../../shared/api';

export interface NicknameRecord {
  id?: number | null;
  nickname?: string;
  createdAt?: string;
  audioCount?: number;
  emotionCount?: number;
  representativeEmotion?: {
    type: string;
    step: number;
  };
}

// API 응답 타입들
export type NicknameRecordResponse = ApiResponse<NicknameRecord>;
