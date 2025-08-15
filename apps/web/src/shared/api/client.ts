import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from './config';
import type { ApiResponse, RequestOptions } from './types';

class ApiClient {
  private client: AxiosInstance;
  private timeout: number;

  constructor() {
    this.timeout = API_CONFIG.TIMEOUT;

    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
      // withCredentials: false, // 쿠키 사용시 활성화
    });

    // 요청 인터셉터
    this.client.interceptors.request.use(config => {
      // 요청 전 처리 (예: 토큰 추가)
      return config;
    });

    // 응답 인터셉터
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      error => {
        // 에러 처리
        if (error.response) {
          // 서버 응답이 있는 경우
          const { status, data } = error.response;
          console.error(`API Error ${status}:`, data);
        } else if (error.request) {
          // 요청은 보냈지만 응답이 없는 경우
          console.error('Network Error:', error.request);
        } else {
          // 요청 설정 중 에러
          console.error('Request Error:', error.message);
        }
        return error;
      }
    );
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.timeout,
    } = options;

    const config: AxiosRequestConfig = {
      method,
      url: endpoint,
      headers,
      timeout,
    };

    if (body) {
      if (body instanceof FormData) {
        config.data = body;
        // FormData를 사용할 때는 Content-Type을 설정하지 않음
        delete config.headers?.['Content-Type'];
      } else {
        config.data = body;
      }
    }

    try {
      const response = await this.client.request<ApiResponse<T>>(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout');
        }
        if (error.response) {
          // 서버에서 에러 응답을 보낸 경우
          const errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            `HTTP error! status: ${error.response.status}`;
          throw new Error(errorMessage);
        }
        throw new Error(error.message);
      }
      throw new Error('Unknown error occurred');
    }
  }

  // GET 요청
  async get<T>(
    endpoint: string,
    options?: Omit<RequestOptions, 'method'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  // POST 요청
  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  // PUT 요청
  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  // PATCH 요청
  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  // DELETE 요청
  async delete<T>(
    endpoint: string,
    options?: Omit<RequestOptions, 'method'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // 파일 업로드를 위한 별도 메서드
  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    return this.post<T>(endpoint, formData);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
