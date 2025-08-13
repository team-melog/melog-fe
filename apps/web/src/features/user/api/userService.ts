import { apiClient } from '../../../shared/api';
import { API_ENDPOINTS } from '../../../shared/api/config';
import type { NicknameRecord, NicknameRecordResponse } from './types';

// 닉네임 조회
export class UserService {
  static async getNickname(nickname: string): Promise<NicknameRecordResponse> {
    return apiClient.get<NicknameRecord>(`${API_ENDPOINTS.USER}/${nickname}`);
  }

  // 닉네임 생성
  static async createNickname(
    nickname: string
  ): Promise<NicknameRecordResponse> {
    return apiClient.post<NicknameRecord>(`${API_ENDPOINTS.USER}`, {
      nickname,
    });
  }

  // 감정 기록 수정
  static async updateNicknameRecord(request: {
    nickname: string;
    newNickname: string;
  }): Promise<NicknameRecordResponse> {
    return apiClient.put<NicknameRecord>(
      `${API_ENDPOINTS.USER}/${request.nickname}`,
      { newNickname: request.newNickname }
    );
  }

  // 감정 기록 삭제
  static async deleteNicknameRecord(nickname: string) {
    return apiClient.delete<NicknameRecord>(
      `${API_ENDPOINTS.USER}/${nickname}`
    );
  }
}

export default UserService;
