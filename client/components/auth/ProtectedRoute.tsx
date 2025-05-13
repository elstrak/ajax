// components/auth/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/api";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      // Проверяем наличие токена
      const { token } = authService.getAuthState();
      
      if (!token) {
        // Если токена нет, перенаправляем на главную
        router.push("/");
        return;
      }
      
      try {
        // Проверяем валидность токена
        await authService.getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        // Если токен невалидный, выполняем выход и перенаправляем
        console.error("Auth token validation failed:", error);
        authService.logout();
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}