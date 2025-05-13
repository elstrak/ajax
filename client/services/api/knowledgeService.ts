import { API_ENDPOINTS } from './constants';
import { get } from './apiClient';
import { VulnerabilitySeverity } from './analyzeService';

// Interfaces for knowledge base
export interface VulnerabilityKnowledge {
  _id: string;
  name: string;
  description: string;
  severity: VulnerabilitySeverity;
  category: string;
}

export interface VulnerabilityKnowledgeDetailed extends VulnerabilityKnowledge {
  details: string;
  remediation: string;
  examples: {
    vulnerable: string;
    fixed: string;
  };
  references: string[];
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface VulnerabilitiesResponse {
  vulnerabilities: VulnerabilityKnowledge[];
  pagination: PaginationInfo;
}

export interface VulnerabilitiesBySeverity {
  severity: VulnerabilitySeverity;
  vulnerabilities: VulnerabilityKnowledge[];
}

const knowledgeService = {
  // Get all vulnerabilities with optional filtering
  getVulnerabilities: async (
    page: number = 1, 
    limit: number = 10,
    category?: string,
    severity?: VulnerabilitySeverity
  ): Promise<VulnerabilitiesResponse> => {
    return get<VulnerabilitiesResponse>(
      API_ENDPOINTS.KNOWLEDGE.VULNERABILITIES,
      { page, limit, category, severity }
    );
  },

  // Get detailed information about specific vulnerability
  getVulnerabilityById: async (id: string): Promise<{ vulnerability: VulnerabilityKnowledgeDetailed }> => {
    return get<{ vulnerability: VulnerabilityKnowledgeDetailed }>(
      API_ENDPOINTS.KNOWLEDGE.VULNERABILITY(id)
    );
  },

  // Get all vulnerability categories
  getCategories: async (): Promise<{ categories: string[] }> => {
    return get<{ categories: string[] }>(API_ENDPOINTS.KNOWLEDGE.CATEGORIES);
  },

  // Get vulnerabilities grouped by severity
  getVulnerabilitiesBySeverity: async (): Promise<{ vulnerabilitiesBySeverity: VulnerabilitiesBySeverity[] }> => {
    return get<{ vulnerabilitiesBySeverity: VulnerabilitiesBySeverity[] }>(
      API_ENDPOINTS.KNOWLEDGE.SEVERITY
    );
  },
};

export default knowledgeService;