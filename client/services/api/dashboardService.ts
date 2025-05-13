import { API_ENDPOINTS } from './constants';
import { get } from './apiClient';

// Interfaces for dashboard data
export interface DashboardStats {
  totalScans: number;
  totalVulnerabilities: number;
  averageSecurityScore: number;
}

export interface RecentScan {
  _id: string;
  sourceType: string;
  fileName?: string;
  contractAddress?: string;
  network?: string;
  status: string;
  securityScore: number;
  createdAt: string;
  completedAt?: string;
}

export interface TopVulnerability {
  name: string;
  count: number;
  severity: string;
  category: string;
}

const dashboardService = {
  // Get dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    return get<DashboardStats>(API_ENDPOINTS.DASHBOARD.STATS);
  },

  // Get recent scans
  getRecentScans: async (): Promise<{ recentScans: RecentScan[] }> => {
    return get<{ recentScans: RecentScan[] }>(API_ENDPOINTS.DASHBOARD.RECENT_SCANS);
  },

  // Get top vulnerabilities
  getTopVulnerabilities: async (): Promise<{ topVulnerabilities: TopVulnerability[] }> => {
    return get<{ topVulnerabilities: TopVulnerability[] }>(API_ENDPOINTS.DASHBOARD.TOP_VULNERABILITIES);
  },
};

export default dashboardService;
