import { API_ENDPOINTS } from './constants';
import { post, get } from './apiClient';

// Blockchain network enum
export enum BlockchainNetwork {
  ETHEREUM = 'ethereum',
  BINANCE = 'binance',
  POLYGON = 'polygon',
  ARBITRUM = 'arbitrum',
  OPTIMISM = 'optimism'
}

// Vulnerability severity enum
export enum VulnerabilitySeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info'
}

// Interfaces for analyze requests
export interface AnalyzeCodeRequest {
  code: string;
}

export interface AnalyzeContractRequest {
  contractAddress: string;
  network: BlockchainNetwork;
}

// Interfaces for vulnerability
export interface Vulnerability {
  name: string;
  description: string;
  severity: VulnerabilitySeverity;
  lineNumber?: number;
  code?: string;
  category: string;
}

// Interfaces for blockchain analytics
export interface BlockchainTransaction {
  hash: string;
  timestamp: string;
  from: string;
  to: string;
  value: string;
}

export interface BlockchainAnalytics {
  balance: string;
  transactions: BlockchainTransaction[];
  lastActivity?: string;
}

// Interfaces for scan results
export interface ScanResponse {
  message: string;
  scanId: string;
}

export interface ScanResult {
  scan: {
    _id: string;
    userId: string;
    sourceType: string;
    sourceContent?: string;
    fileName?: string;
    contractAddress?: string;
    network?: BlockchainNetwork;
    status: string;
    securityScore: number;
    vulnerabilities: Vulnerability[];
    blockchainAnalytics?: BlockchainAnalytics;
    createdAt: string;
    completedAt?: string;
  };
}

const analyzeService = {
  // Analyze code
  analyzeCode: async (code: string): Promise<ScanResponse> => {
    return post<ScanResponse>(API_ENDPOINTS.ANALYZE.CODE, { code });
  },

  // Analyze file (using FormData)
  analyzeFile: async (file: File): Promise<ScanResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return post<ScanResponse>(API_ENDPOINTS.ANALYZE.FILE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Analyze contract by address
  analyzeContract: async (contractAddress: string, network: BlockchainNetwork): Promise<ScanResponse> => {
    return post<ScanResponse>(API_ENDPOINTS.ANALYZE.CONTRACT, { contractAddress, network });
  },

  // Get analysis results
  getAnalysisResults: async (scanId: string): Promise<ScanResult> => {
    return get<ScanResult>(API_ENDPOINTS.ANALYZE.RESULTS(scanId));
  },

  // Get blockchain analytics
  getBlockchainAnalytics: async (address: string, network: BlockchainNetwork): Promise<{ blockchainData: BlockchainAnalytics }> => {
    return get<{ blockchainData: BlockchainAnalytics }>(
      API_ENDPOINTS.ANALYZE.BLOCKCHAIN(address),
      { network }
    );
  },
};

export default analyzeService;