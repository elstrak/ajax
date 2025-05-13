import Cookies from 'js-cookie';
import { TOKEN_COOKIE_NAME, USER_COOKIE_NAME } from './constants';

// Cookie expiration in days
const COOKIE_EXPIRES = 7;

// Default cookie options
const cookieOptions = {
  expires: COOKIE_EXPIRES,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

// User data interface
export interface UserData {
  id: string;
  email: string;
  name: string;
}

// Auth state interface
export interface AuthState {
  token: string | null;
  user: UserData | null;
  isAuthenticated: boolean;
}

// Save auth token to cookie
export const saveAuthToken = (token: string): void => {
  Cookies.set(TOKEN_COOKIE_NAME, token, cookieOptions);
};

// Get auth token from cookie
export const getAuthToken = (): string | null => {
  return Cookies.get(TOKEN_COOKIE_NAME) || null;
};

// Remove auth token from cookie
export const removeAuthToken = (): void => {
  Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' });
};

// Save user data to cookie
export const saveUserData = (userData: UserData): void => {
  Cookies.set(USER_COOKIE_NAME, JSON.stringify(userData), cookieOptions);
};

// Get user data from cookie
export const getUserData = (): UserData | null => {
  const userData = Cookies.get(USER_COOKIE_NAME);
  return userData ? JSON.parse(userData) : null;
};

// Remove user data from cookie
export const removeUserData = (): void => {
  Cookies.remove(USER_COOKIE_NAME, { path: '/' });
};

// Get auth state from cookies
export const getAuthState = (): AuthState => {
  const token = getAuthToken();
  const user = getUserData();
  
  return {
    token,
    user,
    isAuthenticated: Boolean(token) && Boolean(user)
  };
};

// Clear all auth cookies
export const clearAuthCookies = (): void => {
  removeAuthToken();
  removeUserData();
};