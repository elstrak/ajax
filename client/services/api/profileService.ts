import { API_ENDPOINTS } from './constants';
import { get, put } from './apiClient';

export interface ProfileData {
  name: string;
  about?: string;
  city?: string;
  website?: string;
  skills?: string[];
  specializations?: string[];
  avatar?: string;
  contacts?: {
    email?: string;
    twitter?: string;
    github?: string;
    [key: string]: string | undefined;
  };
  createdAt?: string;
}

export interface Contribution {
  _id: string;
  name: string;
  description: string;
  details: string;
  severity: string;
  category: string;
  remediation: string;
  examples: {
    vulnerable: string;
    fixed: string;
  };
  references: string[];
  authorId?: string;
}

const profileService = {
  getProfile: async (): Promise<ProfileData> => {
    return get(API_ENDPOINTS.PROFILE.BASE);
  },
  updateProfile: async (data: Partial<ProfileData>): Promise<ProfileData> => {
    return put(API_ENDPOINTS.PROFILE.BASE, data);
  },
  getContributions: async (): Promise<Contribution[]> => {
    return get(API_ENDPOINTS.PROFILE.CONTRIBUTIONS);
  },
};

export default profileService; 