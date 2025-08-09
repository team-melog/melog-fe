export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

export const API_ENDPOINTS = {
  EMOTION: {
    RECORD: '/emotion/record',
    ANALYZE: '/emotion/analyze',
    HISTORY: '/emotion/history',
  },
  USER: '/users',
  FEED: {
    LIST: '/feed',
    DETAIL: '/feed/:id',
    CREATE: '/feed/create',
  },
} as const;

export const QUERY_KEYS = {
  NICKNAME: 'nickname',
};
