// API Base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Cookie names
export const TOKEN_COOKIE_NAME = 'auth_token';
export const USER_COOKIE_NAME = 'user_data';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me',
  },
  
  // Dashboard endpoints
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
    RECENT_SCANS: '/api/dashboard/recent-scans',
    TOP_VULNERABILITIES: '/api/dashboard/top-vulnerabilities',
  },
  
  // Analyze endpoints
  ANALYZE: {
    CODE: '/api/analyze/code',
    FILE: '/api/analyze/file',
    CONTRACT: '/api/analyze/contract',
    RESULTS: (scanId: string) => `/api/analyze/results/${scanId}`,
    BLOCKCHAIN: (address: string) => `/api/analyze/blockchain/${address}`,
  },
  
  // History endpoints
  HISTORY: {
    LIST: '/api/history',
    DETAILS: (scanId: string) => `/api/history/${scanId}`,
    DOWNLOAD: (scanId: string) => `/api/history/${scanId}/download`,
    DELETE: (id: string) => `/api/history/${id}`,
    STATS: '/api/history/stats'
  },
  
  // Knowledge endpoints
  KNOWLEDGE: {
    VULNERABILITIES: '/api/knowledge/vulnerabilities',
    VULNERABILITY: (id: string) => `/api/knowledge/vulnerabilities/${id}`,
    CATEGORIES: '/api/knowledge/categories',
    SEVERITY: '/api/knowledge/severity',
  },
  
  // Profile endpoints
  PROFILE: {
    BASE: '/api/profile',
    CONTRIBUTIONS: '/api/profile/contributions',
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};