// API Base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Cookie names
export const TOKEN_COOKIE_NAME = 'auth_token';
export const USER_COOKIE_NAME = 'user_data';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  
  // Dashboard endpoints
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_SCANS: '/dashboard/recent-scans',
    TOP_VULNERABILITIES: '/dashboard/top-vulnerabilities',
  },
  
  // Analyze endpoints
  ANALYZE: {
    CODE: '/analyze/code',
    FILE: '/analyze/file',
    CONTRACT: '/analyze/contract',
    RESULTS: (scanId: string) => `/analyze/results/${scanId}`,
    BLOCKCHAIN: (address: string) => `/analyze/blockchain/${address}`,
  },
  
  // History endpoints
  HISTORY: {
    LIST: '/api/history',
    DETAILS: (scanId: string) => `/history/${scanId}`,
    DOWNLOAD: (scanId: string) => `/history/${scanId}/download`,
    DELETE: (id: string) => `/api/history/${id}`,
    STATS: '/api/history/stats'
  },
  
  // Knowledge endpoints
  KNOWLEDGE: {
    VULNERABILITIES: '/knowledge/vulnerabilities',
    VULNERABILITY: (id: string) => `/knowledge/vulnerabilities/${id}`,
    CATEGORIES: '/knowledge/categories',
    SEVERITY: '/knowledge/severity',
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