import { apiClient } from '../../../shared/api';
import { API_ENDPOINTS } from '../../../shared/api/config';
import type {
  EmotionRecord,
  //   EmotionAnalysisRequest,
  //   EmotionAnalysisResult,
  CreateEmotionRecordRequest,
  UpdateEmotionRecordRequest,
  EmotionStats,
  EmotionRecordResponse,
  //   EmotionAnalysisResponse,
  EmotionRecordsResponse,
  EmotionStatsResponse,
  EmotionMonthlyResponse,
} from './types';

export class EmotionService {
  // 감정 분석
  //   static async analyzeEmotion(
  //     request: EmotionAnalysisRequest
  //   ): Promise<EmotionAnalysisResponse> {
  //     const formData = new FormData();
  //     formData.append('audioFile', request.audioFile);
  //     if (request.userSelectedEmotion) {
  //       formData.append('userSelectedEmotion', request.userSelectedEmotion);
  //     }

  //     return apiClient.post<EmotionAnalysisResult>(
  //       API_ENDPOINTS.EMOTION.ANALYZE,
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       }
  //     );
  //   }

  // 감정 기록 생성
  static async createEmotion(
    nickname: string,
    request: CreateEmotionRecordRequest,
    formData?: FormData
  ) {
    // FormData를 사용하여 파일과 함께 전송
    return apiClient.post<EmotionRecord>(
      API_ENDPOINTS.EMOTION.LIST.replace(':nickname', nickname),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  // 감정 기록 조회 (페이지네이션)
  static async getEmotionList(nickname: string, page: number, size: number) {
    const url = API_ENDPOINTS.EMOTION.HISTORY.replace(':nickname', nickname);
    // console.log('url', url, nickname, page, size);
    return apiClient.get<EmotionRecordsResponse>(
      `${url}?page=${page}&size=${size}`
    );
  }

  // 감정 기록 상세 조회
  static async getEmotionDetail(id: string): Promise<EmotionRecordResponse> {
    return apiClient.get<EmotionRecord>(`${API_ENDPOINTS.EMOTION.LIST}/${id}`);
  }

  // 감정 기록 수정
  static async updateEmotion(
    id: string,
    request: UpdateEmotionRecordRequest
  ): Promise<EmotionRecordResponse> {
    return apiClient.put<EmotionRecord>(
      `${API_ENDPOINTS.EMOTION.LIST}/${id}`,
      request
    );
  }

  // 감정 기록 삭제
  static async deleteEmotion(id: string): Promise<EmotionRecordResponse> {
    return apiClient.delete<EmotionRecord>(
      `${API_ENDPOINTS.EMOTION.LIST}/${id}`
    );
  }

  // 감정 통계 조회
  static async getEmotionStats(): Promise<EmotionStatsResponse> {
    return apiClient.get<EmotionStats>(
      `${API_ENDPOINTS.EMOTION.HISTORY}/stats`
    );
  }

  // 캘린더 월별 조회
  static async getEmotionMonthly(
    nickname: string,
    month: string
  ): Promise<EmotionMonthlyResponse> {
    return apiClient.get(
      `${API_ENDPOINTS.EMOTION.MONTHLY.replace(':nickname', nickname)}?month=${month}`
    );
  }
}

export default EmotionService;
