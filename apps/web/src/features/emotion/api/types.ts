import type { ApiResponse, PaginatedResponse } from '../../../shared/api';

// 감정 기록 타입
export interface EmotionRecord {
  id: string;
  userId: string;
  emotion: string;
  intensity: number;
  userSelectedEmotion?: string; // {"type":"설렘","percentage":30}
  audioUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// 감정 분석 요청 타입
export interface EmotionAnalysisRequest {
  audioFile: File;
  text?: string;
  userSelectedEmotion?: { type: string[]; percentage: number };
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

// 감정 기록 생성 요청 타입 - 음섬 or 텍스트
export interface CreateEmotionRecordRequest {
  audioFile?: File;
  text?: string;
  userSelectedEmotion?: { type: string | null; percentage: number };
}

// 감정 기록 수정 요청 타입
export interface UpdateEmotionRecordRequest {
  emotions: {
    type: string;
    percentage: number;
  }[];
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
export interface EmotionMonthly {
  date: string[];
  emotions: {
    type: string;
    percentage: number;
    step: number;
  }[];
}

export interface EmotionListResponse {
  content: {
    id: number;
    date: string;
    summary: string;
    comment: string | null;
    audioFilePath: string | null;
    hasAudioFile: boolean;
    emotions: {
      id: number;
      percentage: number;
      step: number;
      type: string;
    }[];
  }[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface EmotionInsightResponse {
  monthlySummary: string;
  topKeywords: {
    id: number;
    keyword: string;
    weight: number;
  }[];
}

export interface EmotionUpdateResponse {
  id: number;
  text: string;
  summary: string;
  comment: string;
  emotions: {
    type: string;
    percentage: number;
    step: number;
  }[];
  userSelectedEmotion: {
    type: string;
    percentage: number;
    step: number;
  };
}

// 감정 기록 상세 조회 응답 타입
export interface EmotionDetailResponse {
  id: number;
  text: string;
  summary: string;
  comment?: string;
  date: string;
  createdAt: string;
  emotions: {
    type: string;
    percentage: number;
    step: number;
  }[];
  userSelectedEmotion: {
    id: number;
    type: string;
    percentage: number;
    step?: number;
  };
  // emotionKeywords: {
  //   id: number;
  //   keyword: string;
  //   weight: number;
  // }[];
  // user: {
  //   id?: number | null;
  //   nickname: string;
  //   createdAt?: string;
  // };
  audioFilePath?: string | null;
  hasAudioFile?: boolean | null;
}

// API 응답 타입들
export type EmotionRecordResponse = ApiResponse<EmotionRecord>;
export type EmotionAnalysisResponse = ApiResponse<EmotionAnalysisResult>;
export type EmotionRecordsResponse = PaginatedResponse<EmotionRecord>;
export type EmotionStatsResponse = ApiResponse<EmotionStats>;
export type EmotionMonthlyResponse = ApiResponse<EmotionMonthly>;
