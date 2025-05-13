import { API_ENDPOINTS } from './constants';
import { post, get } from './apiClient';
import { saveAuthToken, saveUserData, clearAuthCookies, getAuthState, UserData } from './cookieUtils';

// Auth response interfaces
export interface LoginResponse {
  token: string;
  user: UserData;
}

export interface RegisterResponse {
  token: string;
  user: UserData;
}

// Auth request interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// Auth service functions
const authService = {
  // Log in a user
  login: async (credentials: LoginRequest): Promise<UserData> => {
    try {
      const response = await post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      // Save token and user data to cookies
      saveAuthToken(response.token);
      saveUserData(response.user);
      
      return response.user;
    } catch (error) {
      throw error;
    }
  },
  
  // Register a new user
  register: async (userData: RegisterRequest): Promise<UserData> => {
    try {
      const response = await post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      // Save token and user data to cookies
      saveAuthToken(response.token);
      saveUserData(response.user);
      
      return response.user;
    } catch (error) {
      throw error;
    }
  },
  
  // Get current user profile
  getCurrentUser: async (): Promise<UserData> => {
    try {
      const response = await get<{ user: UserData }>(API_ENDPOINTS.AUTH.ME);
      
      // Update user data in cookies
      saveUserData(response.user);
      
      return response.user;
    } catch (error) {
      throw error;
    }
  },
  
  // Logout user
  logout: (): void => {
    // Очищаем куки
    clearAuthCookies();
    
    console.log("Токены аутентификации удалены");
    
    // В Next.js также может быть полезно использовать локальные состояния через Context
    // Если у вас есть глобальное состояние, его тоже нужно очистить
    
    // Опционально можно выполнить запрос к API для закрытия сессии на сервере
    // Но это не обязательно, так как JWT токены не хранят состояние на сервере
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const { isAuthenticated } = getAuthState();
    return isAuthenticated;
  },
  
  // Get auth state
  getAuthState: getAuthState,
};

export default authService;