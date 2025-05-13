import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL } from './constants';
import { getAuthToken, clearAuthCookies } from './cookieUtils';

// Create Axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Add request interceptor for auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAuthToken();
    
    // If token exists, add it to headers
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear auth cookies and redirect to login if unauthorized
      clearAuthCookies();
      
      // If in browser environment, redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Generic GET request
export const get = async <T>(url: string, params?: object): Promise<T> => {
  try {
    const response = await apiClient.get<T>(url, { params });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Generic POST request
export const post = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Generic PUT request
export const put = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Generic DELETE request
export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Helper function to handle API errors
const handleApiError = (error: any): void => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // Log error for debugging
    console.error('API Error:', {
      url: axiosError.config?.url,
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
    });
    
    // Handle different error types here if needed
  } else {
    // For non-Axios errors
    console.error('Unexpected error:', error);
  }
};

// Export default apiClient instance
export default apiClient;