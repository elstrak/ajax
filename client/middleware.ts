// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TOKEN_COOKIE_NAME } from './services/api/constants';

// Пути, которые не требуют аутентификации
const publicPaths = ['/', '/auth/login', '/auth/register', '/api'];

export function middleware(request: NextRequest) {
  // Получаем токен из cookies
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
  
  // Проверяем путь запроса
  const path = request.nextUrl.pathname;
  
  // Проверяем, является ли текущий путь публичным
  const isPublicPath = publicPaths.some(
    publicPath => path === publicPath || path.startsWith(`${publicPath}/`)
  );
  
  // Если путь не публичный и токен отсутствует, перенаправляем на главную
  if (!isPublicPath && !token) {
    // Создаем URL для перенаправления
    const redirectUrl = new URL('/', request.url);
    // Добавляем параметр для возможного открытия модального окна авторизации
    redirectUrl.searchParams.set('auth', 'required');
    
    return NextResponse.redirect(redirectUrl);
  }
  
  // Если путь публичный и токен присутствует, можно сразу перенаправить на дашборд
  // (этот блок опционален, раскомментируйте если нужно)
  /*
  if ((path === '/' || path === '/auth/login' || path === '/auth/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  */
  
  // В остальных случаях продолжаем обработку запроса
  return NextResponse.next();
}

// Настраиваем для каких маршрутов будет применяться middleware
export const config = {
  // Применяем middleware ко всем маршрутам, кроме статических файлов и API
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};