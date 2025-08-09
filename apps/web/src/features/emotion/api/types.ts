import type { ApiResponse, PaginatedResponse } from '../../../shared/api';

// 감정 기록 타입
export interface EmotionRecord {
  id: string;
  userId: string;
  emotion: string;
  intensity: number;
  description?: string;
  audioUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// 감정 분석 요청 타입
export interface EmotionAnalysisRequest {
  audioFile: File;
  description?: string;
}

// 감정 분석 결과 타입
export interface EmotionAnalysisResult {
  emotion: string;
  confidence: number;
  intensity: number;
  suggestions: string[];
  analysis: {
    primaryEmotion: string;
    secondaryEmotions: string[];
    mood: 'positive' | 'neutral' | 'negative';
  };
}

// 감정 기록 생성 요청 타입
export interface CreateEmotionRecordRequest {
  emotion: string;
  intensity: number;
  description?: string;
  audioUrl?: string;
}

// 감정 기록 수정 요청 타입
export interface UpdateEmotionRecordRequest {
  emotion?: string;
  intensity?: number;
  description?: string;
}

// 감정 통계 타입
export interface EmotionStats {
  totalRecords: number;
  emotionDistribution: Record<string, number>;
  averageIntensity: number;
  weeklyTrend: Array<{
    date: string;
    averageEmotion: string;
    averageIntensity: number;
  }>;
}

// API 응답 타입들
export type EmotionRecordResponse = ApiResponse<EmotionRecord>;
export type EmotionAnalysisResponse = ApiResponse<EmotionAnalysisResult>;
export type EmotionRecordsResponse = PaginatedResponse<EmotionRecord>;
export type EmotionStatsResponse = ApiResponse<EmotionStats>;
