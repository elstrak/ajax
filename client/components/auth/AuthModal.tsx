// components/auth/AuthModal.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
  redirectUrl?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultTab = "login",
  redirectUrl,
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Получаем URL для перенаправления из параметров запроса или props
  const redirect = redirectUrl || searchParams.get('redirect') || '/dashboard';

  // Обработчик успешной аутентификации
  const handleAuthSuccess = () => {
    onClose();
    router.push(redirect);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Аутентификация</DialogTitle>
          <DialogDescription>
            Войдите или зарегистрируйтесь для доступа к анализу смарт-контрактов.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm onSuccess={handleAuthSuccess} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm onSuccess={handleAuthSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}