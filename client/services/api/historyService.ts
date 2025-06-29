// client/services/api/historyService.ts

import { API_ENDPOINTS } from './constants';
import { get, del, post } from './apiClient';
import { BlockchainNetwork, Vulnerability, VulnerabilitySeverity } from './analyzeService';

// Интерфейсы для истории
export interface HistoryScan {
  _id: string;
  name: string;
  sourceType: string;
  fileName?: string;
  contractAddress?: string;
  network?: BlockchainNetwork;
  status: string;
  securityScore: number;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  createdAt: string;
  completedAt?: string;
  sourceContent?: string;
  blockchainAnalytics?: any;
}

export interface HistoryStats {
  securityTrends: {
    day: string;
    rating: number;
  }[];
  vulnerabilityDistribution: {
    name: string;
    percentage: number;
  }[];
  networkActivity: {
    network: string;
    percentage: number;
  }[];
  recentIncidents: {
    title: string;
    date: string;
    description: string;
    severity: VulnerabilitySeverity;
    link?: string;
  }[];
}

export interface ScanHistoryResponse {
  scans: HistoryScan[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const historyService = {
  // Get scan history with pagination
  getScanHistory: async (
    page: number = 1, 
    limit: number = 10,
    searchQuery?: string,
    timeRange?: string,
    filters?: Record<string, any>
  ): Promise<ScanHistoryResponse> => {
    const params: Record<string, any> = { page, limit };
    
    if (searchQuery) params.search = searchQuery;
    if (timeRange && timeRange !== 'all') params.timeRange = timeRange;
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params[key] = value;
      });
    }
    
    return get<ScanHistoryResponse>(API_ENDPOINTS.HISTORY.LIST, params);
  },
  
  // Get history statistics
  getHistoryStats: async (): Promise<HistoryStats> => {
    return get<HistoryStats>(`${API_ENDPOINTS.HISTORY.STATS}`);
  },

  // Delete scan from history
  deleteScan: async (scanId: string): Promise<{ message: string }> => {
    return del<{ message: string }>(API_ENDPOINTS.HISTORY.DELETE(scanId));
  },

  // Add scan to history
  addScan: async (scanData: Partial<HistoryScan> & { vulnerabilities: any[] }) => {
    return post(API_ENDPOINTS.HISTORY.LIST, scanData);
  },
};

export default historyService;