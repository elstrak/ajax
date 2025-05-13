"use client"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  Blocks,
  ChevronsUpDown,
  Code,
  FileSearch,
  FileClock,
  GraduationCap,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageSquareText,
  MessagesSquare,
  Plus,
  Settings,
  Shield,
  UserCircle,
  UserCog,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { authService } from "@/services/api"

const sidebarVariants = {
  open: {
    width: "15rem",
  },
  closed: {
    width: "3.05rem",
  },
}

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
}

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      x: { stiffness: 100 },
    },
  },
}

const transitionProps = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
  staggerChildren: 0.1,
}

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
}

export function SessionNavBar() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Получаем информацию о пользователе при монтировании компонента
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authState = authService.getAuthState()
        if (authState.user) {
          setUser({
            name: authState.user.name,
            email: authState.user.email
          })
        } else {
          // Пробуем получить данные с сервера
          const userData = await authService.getCurrentUser()
          setUser({
            name: userData.name,
            email: userData.email
          })
        }
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error)
        // Если не удалось получить данные, логируем это
        console.log("Перенаправление на главную из-за ошибки авторизации")
      }
    }

    fetchUserData()
  }, [router])

  // Функция для выхода из системы
  const handleLogout = () => {
    try {
      console.log("Выполняется выход из системы...");
      authService.logout();
      console.log("Выход выполнен успешно");
      
      // Важно использовать router.push для клиентской навигации
      router.push("/");
      
      // Дополнительно можно добавить принудительное обновление страницы
      // для полной очистки состояния приложения
      // window.location.href = "/";
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error);
    }
  }

  // Получаем инициалы пользователя
  const getUserInitials = () => {
    if (!user?.name) return "?"
    
    const names = user.name.split(" ")
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return names[0][0].toUpperCase()
  }

  return (
    <motion.div
      className={cn("sidebar fixed left-0 z-40 h-full shrink-0 border-r fixed bg-firmament")}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <motion.div
        className={`relative z-40 flex text-autumn h-full shrink-0 flex-col bg-firmament border-firmament-light transition-all`}
        variants={contentVariants}
      >
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <div className="flex grow flex-col items-center">
            <div className="flex h-[54px] w-full shrink-0 border-b border-firmament-light p-2">
              <div className="mt-[1.5px] flex w-full">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className="w-full" asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex w-fit items-center gap-2 px-2 text-autumn hover:bg-firmament-light"
                    >
                      <Shield className="h-4 w-4 text-demonic" />
                      <motion.li variants={variants} className="flex w-fit items-center gap-2">
                        {!isCollapsed && (
                          <>
                            <p className="text-sm font-medium">{"DeepGuard"}</p>
                            <ChevronsUpDown className="h-4 w-4 text-autumn/50" />
                          </>
                        )}
                      </motion.li>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="bg-firmament-light border-firmament-lighter text-autumn"
                  >
                    <DropdownMenuItem asChild className="flex items-center gap-2 hover:bg-firmament-lighter">
                      <Link href="/settings/members">
                        <UserCog className="h-4 w-4" /> Управление командой
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="flex items-center gap-2 hover:bg-firmament-lighter">
                      <Link href="/settings/integrations">
                        <Blocks className="h-4 w-4" /> Интеграции
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-firmament-lighter">
                      <Link href="/select-org" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Создать новый проект
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex h-full w-full flex-col">
              <div className="flex grow flex-col gap-4">
                <ScrollArea className="h-16 grow p-2">
                  <div className={cn("flex w-full flex-col gap-1")}>
                    <Link
                      href="/dashboard"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-firmament-light",
                        pathname?.includes("dashboard") && "bg-firmament-light text-atomic",
                      )}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!isCollapsed && <p className="ml-2 text-sm font-medium">Панель управления</p>}
                      </motion.li>
                    </Link>
                    <Link
                      href="/analyze"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-firmament-light",
                        pathname?.includes("analyze") && "bg-firmament-light text-atomic",
                      )}
                    >
                      <FileSearch className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <div className="flex items-center gap-2">
                            <p className="ml-2 text-sm font-medium">Анализ</p>
                          </div>
                        )}
                      </motion.li>
                    </Link>
                    <Link
                      href="/history"
                      className={cn(
                        "flex h-8 flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-firmament-light",
                        pathname?.includes("history") && "bg-firmament-light text-atomic",
                      )}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <div className="ml-2 flex items-center gap-2">
                            <p className="text-sm font-medium">История</p>
                          </div>
                        )}
                      </motion.li>
                    </Link>
                    
                    <Separator className="w-full bg-firmament-lighter" />
                    <Link
                      href="/knowledge"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-firmament-light",
                        pathname?.includes("knowledge") && "bg-firmament-light text-atomic",
                      )}
                    >
                      <Code className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!isCollapsed && <p className="ml-2 text-sm font-medium">База знаний</p>}
                      </motion.li>
                    </Link>
                    {/* <Link
                      href="/protocols"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-firmament-light",
                        pathname?.includes("protocols") && "bg-firmament-light text-atomic",
                      )}
                    >
                      <FileClock className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!isCollapsed && <p className="ml-2 text-sm font-medium">Протоколы</p>}
                      </motion.li>
                    </Link>
                    <Link
                      href="/templates"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-firmament-light",
                        pathname?.includes("templates") && "bg-firmament-light text-atomic",
                      )}
                    >
                      <Lock className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!isCollapsed && <p className="ml-2 text-sm font-medium">Шаблоны</p>}
                      </motion.li>
                    </Link>
                    <Separator className="w-full bg-firmament-lighter" />
                    <Link
                      href="/learn"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-firmament-light",
                        pathname?.includes("learn") && "bg-firmament-light text-atomic",
                      )}
                    >
                      <GraduationCap className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!isCollapsed && <p className="ml-2 text-sm font-medium">Обучение</p>}
                      </motion.li>
                    </Link>
                    <Link
                      href="/support"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-firmament-light",
                        pathname?.includes("support") && "bg-firmament-light text-atomic",
                      )}
                    >
                      <MessageSquareText className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!isCollapsed && <p className="ml-2 text-sm font-medium">Поддержка</p>}
                      </motion.li>
                    </Link> */}
                    <Link
                      href="/contribute"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-firmament-light",
                        pathname?.includes("contribute") && "bg-firmament-light text-atomic",
                      )}
                    >
                      <Zap className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!isCollapsed && <p className="ml-2 text-sm font-medium">Contribute</p>}
                      </motion.li>
                    </Link>
                  </div>
                </ScrollArea>
              </div>
              <div className="flex flex-col p-2">
                <Link
                  href="/settings"
                  className="mt-auto flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-firmament-light"
                >
                  <Settings className="h-4 w-4 shrink-0" />
                  <motion.li variants={variants}>
                    {!isCollapsed && <p className="ml-2 text-sm font-medium">Настройки</p>}
                  </motion.li>
                </Link>
                <div>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="w-full">
                      <div className="flex h-8 w-full flex-row items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-firmament-light">
                        <Avatar className="size-4">
                          <AvatarFallback className="bg-demonic text-autumn text-xs">
                            {user ? getUserInitials()[0] : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <motion.li variants={variants} className="flex w-full items-center gap-2">
                          {!isCollapsed && (
                            <>
                              <p className="text-sm font-medium">Аккаунт</p>
                              <ChevronsUpDown className="ml-auto h-4 w-4 text-autumn/50" />
                            </>
                          )}
                        </motion.li>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      sideOffset={5}
                      className="bg-firmament-light border-firmament-lighter text-autumn"
                    >
                      <div className="flex flex-row items-center gap-2 p-2">
                        <Avatar className="size-6">
                          <AvatarFallback className="bg-demonic text-autumn">
                            {user ? getUserInitials() : "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-medium">{user?.name || "Загрузка..."}</span>
                          <span className="line-clamp-1 text-xs text-autumn/70">{user?.email || "Загрузка..."}</span>
                        </div>
                      </div>
                      <DropdownMenuSeparator className="bg-firmament-lighter" />
                      <DropdownMenuItem asChild className="flex items-center gap-2 hover:bg-firmament-lighter">
                        <Link href="/profile">
                          <UserCircle className="h-4 w-4" /> Профиль
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex items-center gap-2 hover:bg-firmament-lighter cursor-pointer"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" /> Выйти
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  )
}
