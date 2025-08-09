export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

export const API_ENDPOINTS = {
  EMOTION: {
    RECORD: '/api/emotion/record',
    ANALYZE: '/api/emotion/analyze',
    HISTORY: '/api/emotion/history',
  },
  USER: '/api/users',
  FEED: {
    LIST: '/api/feed',
    DETAIL: '/api/feed/:id',
    CREATE: '/api/feed/create',
  },
} as const;
