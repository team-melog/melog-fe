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

  // 감정 기록 목록 조회 (페이지네이션)
  static async getEmotionList(nickname: string, page: number, size: number) {
    const url = API_ENDPOINTS.EMOTION.LIST.replace(':nickname', nickname);
    // console.log('url', url, nickname, page, size);
    return apiClient.get<EmotionRecordsResponse>(
      `${url}?page=${page}&size=${size}`
    );
  }

  // 감정 기록 상세 조회
  static async getEmotionDetail(
    nickname: string,
    id: string
  ): Promise<EmotionRecordResponse> {
    const url = API_ENDPOINTS.EMOTION.LIST.replace(':nickname', nickname);
    return apiClient.get<EmotionRecord>(`${url}/${id}`);
  }

  // 감정 기록 수정
  static async updateEmotion(
    nickname: string,
    id: string,
    request: UpdateEmotionRecordRequest
  ): Promise<EmotionRecordResponse> {
    return apiClient.put<EmotionRecord>(
      `${API_ENDPOINTS.EMOTION.UPDATE.replace(':nickname', nickname).replace(':id', id)}`,
      request
    );
  }

  // 감정 기록 삭제
  static async deleteEmotion(
    nickname: string,
    id: string
  ): Promise<EmotionRecordResponse> {
    const url = API_ENDPOINTS.EMOTION.LIST.replace(':nickname', nickname);
    return apiClient.delete<EmotionRecord>(`${url}/${id}`);
  }

  // 감정 통계 조회
  static async getEmotionChart(
    nickname: string,
    month: string // YYYY-MM
  ): Promise<EmotionStatsResponse> {
    const url = API_ENDPOINTS.CHART.replace(':nickname', nickname);
    return apiClient.get<EmotionStats>(`${url}?month=${month}`);
  }
  // 월별 키워드 및 한줄 요약 조회
  static async getEmotionInsight(
    nickname: string,
    month: string // YYYY-MM
  ): Promise<EmotionStatsResponse> {
    const url = API_ENDPOINTS.INSIGHT.replace(':nickname', nickname);
    return apiClient.get<EmotionStats>(`${url}?month=${month}`);
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
