import { apiClient } from '../../../shared/api';
import { API_ENDPOINTS } from '../../../shared/api/config';
import type {
  EmotionRecord,
  EmotionAnalysisRequest,
  EmotionAnalysisResult,
  CreateEmotionRecordRequest,
  UpdateEmotionRecordRequest,
  EmotionStats,
  EmotionRecordResponse,
  EmotionAnalysisResponse,
  EmotionRecordsResponse,
  EmotionStatsResponse,
} from './types';

export class EmotionService {
  // 감정 분석
  static async analyzeEmotion(
    request: EmotionAnalysisRequest
  ): Promise<EmotionAnalysisResponse> {
    const formData = new FormData();
    formData.append('audioFile', request.audioFile);
    if (request.description) {
      formData.append('description', request.description);
    }

    return apiClient.post<EmotionAnalysisResult>(
      API_ENDPOINTS.EMOTION.ANALYZE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  // 감정 기록 생성
  static async createEmotionRecord(
    request: CreateEmotionRecordRequest
  ): Promise<EmotionRecordResponse> {
    return apiClient.post<EmotionRecord>(API_ENDPOINTS.EMOTION.RECORD, request);
  }

  // 감정 기록 조회 (페이지네이션)
  static async getEmotionRecords(page = 1, limit = 10) {
    return apiClient.get<EmotionRecordsResponse>(
      `${API_ENDPOINTS.EMOTION.HISTORY}?page=${page}&limit=${limit}`
    );
  }

  // 감정 기록 상세 조회
  static async getEmotionRecord(id: string): Promise<EmotionRecordResponse> {
    return apiClient.get<EmotionRecord>(
      `${API_ENDPOINTS.EMOTION.RECORD}/${id}`
    );
  }

  // 감정 기록 수정
  static async updateEmotionRecord(
    id: string,
    request: UpdateEmotionRecordRequest
  ): Promise<EmotionRecordResponse> {
    return apiClient.put<EmotionRecord>(
      `${API_ENDPOINTS.EMOTION.RECORD}/${id}`,
      request
    );
  }

  // 감정 기록 삭제
  static async deleteEmotionRecord(id: string): Promise<EmotionRecordResponse> {
    return apiClient.delete<EmotionRecord>(
      `${API_ENDPOINTS.EMOTION.RECORD}/${id}`
    );
  }

  // 감정 통계 조회
  static async getEmotionStats(): Promise<EmotionStatsResponse> {
    return apiClient.get<EmotionStats>(
      `${API_ENDPOINTS.EMOTION.HISTORY}/stats`
    );
  }
}

export default EmotionService;
