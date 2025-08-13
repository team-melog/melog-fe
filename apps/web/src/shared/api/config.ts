export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_URL + '/api' || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

export const API_ENDPOINTS = {
  EMOTION: {
    LIST: '/users/:nickname/emotions',
    ANALYZE: '/users/:nickname/emotions',
    HISTORY: '/users/:nickname/emotions',
    MONTHLY: '/users/:nickname/emotions/calendar',
    UPDATE: '/users/:nickname/emotions/:id/select',
  },
  USER: '/users',
  FEED: {
    LIST: '/feed',
    DETAIL: '/feed/:id',
    CREATE: '/feed/create',
  },
  CHART: '/users/:nickname/emotions/summary/chart',
  INSIGHT: '/users/:nickname/emotions/summary/insight',
} as const;

export const QUERY_KEYS = {
  NICKNAME: 'nickname',
};
