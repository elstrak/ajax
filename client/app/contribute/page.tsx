"use client"

import { useState } from "react"
import { BookOpen, Code, FileText, GitPullRequest, MessageSquare, Plus, Share2, Users } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { SessionNavBar } from "@/components/session-nav-bar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ContributePage() {
  const [activeTab, setActiveTab] = useState("contribute")

  return (
    <div className="flex min-h-screen bg-firmament">
      {/* Sidebar */}
      <SessionNavBar />

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 ml-[3.05rem]">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-autumn">Вклад в проект</h1>
          <p className="text-autumn-muted mt-2">
            Поделитесь своими знаниями и помогите сообществу улучшить безопасность смарт-контрактов
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-firmament-light mb-6">
            <TabsTrigger value="contribute" className="text-autumn data-[state=active]:bg-firmament-lighter">
              Внести вклад
            </TabsTrigger>
            <TabsTrigger value="submissions" className="text-autumn data-[state=active]:bg-firmament-lighter">
              Мои материалы
            </TabsTrigger>
            <TabsTrigger value="community" className="text-autumn data-[state=active]:bg-firmament-lighter">
              Сообщество
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contribute" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-firmament-light border-firmament-lighter">
                <CardHeader className="pb-2">
                  <CardTitle className="text-autumn flex items-center">
                    <BookOpen className="mr-2 size-5" />
                    Добавить уязвимость
                  </CardTitle>
                  <CardDescription className="text-autumn-muted">
                    Внесите новую уязвимость в базу знаний
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-autumn-muted mb-4">
                    Поделитесь своими знаниями о новых уязвимостях смарт-контрактов, чтобы помочь сообществу
                    разработчиков создавать более безопасные контракты.
                  </p>
                  <ul className="space-y-2 text-autumn-muted mb-4">
                    <li className="flex items-center">
                      <div className="size-1.5 rounded-full bg-atomic mr-2"></div>
                      <span>Подробное описание уязвимости</span>
                    </li>
                    <li className="flex items-center">
                      <div className="size-1.5 rounded-full bg-atomic mr-2"></div>
                      <span>Примеры уязвимого кода</span>
                    </li>
                    <li className="flex items-center">
                      <div className="size-1.5 rounded-full bg-atomic mr-2"></div>
                      <span>Методы обнаружения и предотвращения</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-atomic hover:bg-atomic/90">
                    <Plus className="mr-2 size-4" />
                    Добавить уязвимость
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-firmament-light border-firmament-lighter">
                <CardHeader className="pb-2">
                  <CardTitle className="text-autumn flex items-center">
                    <FileText className="mr-2 size-5" />
                    Опубликовать исследование
                  </CardTitle>
                  <CardDescription className="text-autumn-muted">
                    Поделитесь своими исследованиями в области безопасности
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-autumn-muted mb-4">
                    Опубликуйте статьи, отчеты или исследования о безопасности смарт-контрактов, чтобы поделиться своими
                    знаниями с сообществом.
                  </p>
                  <ul className="space-y-2 text-autumn-muted mb-4">
                    <li className="flex items-center">
                      <div className="size-1.5 rounded-full bg-atomic mr-2"></div>
                      <span>Технические статьи и руководства</span>
                    </li>
                    <li className="flex items-center">
                      <div className="size-1.5 rounded-full bg-atomic mr-2"></div>
                      <span>Анализ реальных инцидентов</span>
                    </li>
                    <li className="flex items-center">
                      <div className="size-1.5 rounded-full bg-atomic mr-2"></div>
                      <span>Методологии аудита и тестирования</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-atomic hover:bg-atomic/90">
                    <Share2 className="mr-2 size-4" />
                    Опубликовать исследование
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-firmament-light border-firmament-lighter">
                <CardHeader className="pb-2">
                  <CardTitle className="text-autumn flex items-center">
                    <Code className="mr-2 size-5" />
                    Предложить шаблон
                  </CardTitle>
                  <CardDescription className="text-autumn-muted">
                    Поделитесь безопасными шаблонами смарт-контрактов
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-autumn-muted mb-4">
                    Предложите проверенные и безопасные шаблоны смарт-контрактов, которые помогут разработчикам избежать
                    распространенных уязвимостей.
                  </p>
                  <ul className="space-y-2 text-autumn-muted mb-4">
                    <li className="flex items-center">
                      <div className="size-1.5 rounded-full bg-atomic mr-2"></div>
                      <span>Безопасные реализации стандартов</span>
                    </li>
                    <li className="flex items-center">
                      <div className="size-1.5 rounded-full bg-atomic mr-2"></div>
                      <span>Шаблоны для DeFi-протоколов</span>
                    </li>
                    <li className="flex items-center">
                      <div className="size-1.5 rounded-full bg-atomic mr-2"></div>
                      <span>Библиотеки безопасности</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-atomic hover:bg-atomic/90">
                    <GitPullRequest className="mr-2 size-4" />
                    Предложить шаблон
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Форма добавления уязвимости</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Заполните форму, чтобы добавить новую уязвимость в базу знаний
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-autumn">
                        Название уязвимости
                      </Label>
                      <Input
                        id="name"
                        placeholder="Например: Reentrancy"
                        className="bg-firmament border-firmament-lighter text-autumn"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="severity" className="text-autumn">
                        Серьезность
                      </Label>
                      <Select>
                        <SelectTrigger className="bg-firmament border-firmament-lighter text-autumn">
                          <SelectValue placeholder="Выберите уровень серьезности" />
                        </SelectTrigger>
                        <SelectContent className="bg-firmament-light border-firmament-lighter text-autumn">
                          <SelectItem value="critical">Критическая</SelectItem>
                          <SelectItem value="high">Высокая</SelectItem>
                          <SelectItem value="medium">Средняя</SelectItem>
                          <SelectItem value="low">Низкая</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="short-description" className="text-autumn">
                      Краткое описание
                    </Label>
                    <Input
                      id="short-description"
                      placeholder="Краткое описание уязвимости (1-2 предложения)"
                      className="bg-firmament border-firmament-lighter text-autumn"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-autumn">
                      Подробное описание
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Подробное описание уязвимости, включая механизм работы и потенциальные последствия"
                      className="min-h-[120px] bg-firmament border-firmament-lighter text-autumn"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vulnerable-code" className="text-autumn">
                      Пример уязвимого кода
                    </Label>
                    <Textarea
                      id="vulnerable-code"
                      placeholder="// Пример кода с уязвимостью"
                      className="min-h-[150px] bg-firmament border-firmament-lighter text-autumn font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secure-code" className="text-autumn">
                      Пример безопасного кода
                    </Label>
                    <Textarea
                      id="secure-code"
                      placeholder="// Пример исправленного кода"
                      className="min-h-[150px] bg-firmament border-firmament-lighter text-autumn font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prevention" className="text-autumn">
                      Методы предотвращения
                    </Label>
                    <Textarea
                      id="prevention"
                      placeholder="Опишите методы предотвращения данной уязвимости"
                      className="min-h-[100px] bg-firmament border-firmament-lighter text-autumn"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="detection" className="text-autumn">
                      Методы обнаружения
                    </Label>
                    <Textarea
                      id="detection"
                      placeholder="Опишите методы обнаружения данной уязвимости"
                      className="min-h-[100px] bg-firmament border-firmament-lighter text-autumn"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="references" className="text-autumn">
                      Ссылки и источники
                    </Label>
                    <Textarea
                      id="references"
                      placeholder="Укажите ссылки на источники, статьи, отчеты и другие материалы"
                      className="min-h-[80px] bg-firmament border-firmament-lighter text-autumn"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" className="border-firmament-lighter text-autumn">
                      Сохранить черновик
                    </Button>
                    <Button className="bg-demonic hover:bg-demonic/90">Отправить на проверку</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Мои материалы</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Ваши предложенные уязвимости, исследования и шаблоны
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="vulnerabilities">
                  <TabsList className="bg-firmament mb-4">
                    <TabsTrigger
                      value="vulnerabilities"
                      className="text-autumn data-[state=active]:bg-firmament-lighter"
                    >
                      Уязвимости
                    </TabsTrigger>
                    <TabsTrigger value="research" className="text-autumn data-[state=active]:bg-firmament-lighter">
                      Исследования
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="text-autumn data-[state=active]:bg-firmament-lighter">
                      Шаблоны
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="vulnerabilities">
                    <div className="rounded-md border border-firmament-lighter overflow-hidden">
                      <table className="w-full text-autumn">
                        <thead>
                          <tr className="bg-firmament-lighter">
                            <th className="px-4 py-2 text-left">Название</th>
                            <th className="px-4 py-2 text-left">Дата</th>
                            <th className="px-4 py-2 text-left">Статус</th>
                            <th className="px-4 py-2 text-left">Действия</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-firmament-lighter">
                          <tr className="hover:bg-firmament">
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="font-medium">Signature Replay Attack</span>
                                <span className="text-autumn-muted text-xs">Критическая</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">12 апр 2023</td>
                            <td className="px-4 py-3">
                              <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                                На проверке
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                                  Редактировать
                                </Button>
                                <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                                  Просмотр
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-firmament">
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="font-medium">Proxy Storage Collision</span>
                                <span className="text-autumn-muted text-xs">Высокая</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">5 апр 2023</td>
                            <td className="px-4 py-3">
                              <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Опубликовано</Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                                  Редактировать
                                </Button>
                                <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                                  Просмотр
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-firmament">
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="font-medium">Uninitialized Proxy</span>
                                <span className="text-autumn-muted text-xs">Средняя</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">28 мар 2023</td>
                            <td className="px-4 py-3">
                              <Badge className="bg-demonic/20 text-demonic border-demonic/30">Отклонено</Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                                  Редактировать
                                </Button>
                                <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                                  Просмотр
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  <TabsContent value="research">
                    <div className="rounded-md border border-firmament-lighter overflow-hidden">
                      <table className="w-full text-autumn">
                        <thead>
                          <tr className="bg-firmament-lighter">
                            <th className="px-4 py-2 text-left">Название</th>
                            <th className="px-4 py-2 text-left">Дата</th>
                            <th className="px-4 py-2 text-left">Статус</th>
                            <th className="px-4 py-2 text-left">Просмотры</th>
                            <th className="px-4 py-2 text-left">Действия</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-firmament-lighter">
                          <tr className="hover:bg-firmament">
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="font-medium">Анализ уязвимостей в DeFi-протоколах 2023</span>
                                <span className="text-autumn-muted text-xs">Исследование</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">15 апр 2023</td>
                            <td className="px-4 py-3">
                              <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Опубликовано</Badge>
                            </td>
                            <td className="px-4 py-3">1,245</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                                  Редактировать
                                </Button>
                                <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                                  Просмотр
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-firmament">
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="font-medium">Методология аудита смарт-контрактов</span>
                                <span className="text-autumn-muted text-xs">Руководство</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">2 апр 2023</td>
                            <td className="px-4 py-3">
                              <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Опубликовано</Badge>
                            </td>
                            <td className="px-4 py-3">876</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                                  Редактировать
                                </Button>
                                <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                                  Просмотр
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  <TabsContent value="templates">
                    <div className="rounded-md border border-firmament-lighter overflow-hidden">
                      <table className="w-full text-autumn">
                        <thead>
                          <tr className="bg-firmament-lighter">
                            <th className="px-4 py-2 text-left">Название</th>
                            <th className="px-4 py-2 text-left">Дата</th>
                            <th className="px-4 py-2 text-left">Статус</th>
                            <th className="px-4 py-2 text-left">Использований</th>
                            <th className="px-4 py-2 text-left">Действия</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-firmament-lighter">
                          <tr className="hover:bg-firmament">
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="font-medium">Безопасный ERC20 с защитой от reentrancy</span>
                                <span className="text-autumn-muted text-xs">Токен</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">10 апр 2023</td>
                            <td className="px-4 py-3">
                              <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Опубликовано</Badge>
                            </td>
                            <td className="px-4 py-3">324</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                                  Редактировать
                                </Button>
                                <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                                  Просмотр
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-firmament">
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="font-medium">Многоподписный кошелек с временной блокировкой</span>
                                <span className="text-autumn-muted text-xs">Кошелек</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">1 апр 2023</td>
                            <td className="px-4 py-3">
                              <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                                На проверке
                              </Badge>
                            </td>
                            <td className="px-4 py-3">0</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                                  Редактировать
                                </Button>
                                <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                                  Просмотр
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Статистика вклада</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Статистика ваших материалов и их влияние на сообщество
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-4">
                  <div className="p-4 rounded-md bg-firmament">
                    <p className="text-autumn-muted text-sm mb-1">Всего материалов</p>
                    <p className="text-autumn text-2xl font-medium">7</p>
                    <p className="text-atomic text-sm">+2 за последний месяц</p>
                  </div>
                  <div className="p-4 rounded-md bg-firmament">
                    <p className="text-autumn-muted text-sm mb-1">Просмотры</p>
                    <p className="text-autumn text-2xl font-medium">2,456</p>
                    <p className="text-atomic text-sm">+543 за последний месяц</p>
                  </div>
                  <div className="p-4 rounded-md bg-firmament">
                    <p className="text-autumn-muted text-sm mb-1">Рейтинг</p>
                    <p className="text-autumn text-2xl font-medium">4.8/5</p>
                    <p className="text-atomic text-sm">На основе 32 оценок</p>
                  </div>
                  <div className="p-4 rounded-md bg-firmament">
                    <p className="text-autumn-muted text-sm mb-1">Репутация</p>
                    <p className="text-autumn text-2xl font-medium">Эксперт</p>
                    <p className="text-atomic text-sm">Топ 5% участников</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-firmament-light border-firmament-lighter">
                <CardHeader>
                  <CardTitle className="text-autumn">Топ контрибьюторов</CardTitle>
                  <CardDescription className="text-autumn-muted">
                    Участники с наибольшим вкладом в базу знаний
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topContributors.map((contributor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-md bg-firmament">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="size-10 border-2 border-firmament-lighter">
                              <AvatarImage src={contributor.avatar || "/placeholder.svg"} alt={contributor.name} />
                              <AvatarFallback className="bg-atomic text-autumn">
                                {contributor.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {index < 3 && (
                              <div className="absolute -top-1 -right-1 size-5 rounded-full bg-demonic flex items-center justify-center text-autumn text-xs font-bold">
                                {index + 1}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-autumn font-medium">{contributor.name}</p>
                            <p className="text-autumn-muted text-xs">{contributor.contributions} материалов</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              index === 0
                                ? "bg-demonic/20 text-demonic border-demonic/30"
                                : "bg-atomic/20 text-atomic border-atomic/30"
                            }
                          >
                            {contributor.level}
                          </Badge>
                          <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                            Профиль
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-firmament-light border-firmament-lighter">
                <CardHeader>
                  <CardTitle className="text-autumn">Последние материалы</CardTitle>
                  <CardDescription className="text-autumn-muted">
                    Недавно добавленные материалы от сообщества
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentContributions.map((contribution, index) => (
                      <div key={index} className="p-3 rounded-md bg-firmament">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-autumn font-medium">{contribution.title}</h3>
                            <p className="text-autumn-muted text-xs">
                              {contribution.type} • {contribution.date}
                            </p>
                          </div>
                          <Badge
                            className={
                              contribution.status === "Опубликовано"
                                ? "bg-green-500/20 text-green-500 border-green-500/30"
                                : "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                            }
                          >
                            {contribution.status}
                          </Badge>
                        </div>
                        <p className="text-autumn-muted text-sm mb-3 line-clamp-2">{contribution.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Avatar className="size-6">
                              <AvatarImage
                                src={contribution.author.avatar || "/placeholder.svg"}
                                alt={contribution.author.name}
                              />
                              <AvatarFallback className="bg-atomic text-autumn text-xs">
                                {contribution.author.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-autumn-muted text-xs">{contribution.author.name}</span>
                          </div>
                          <Button variant="link" size="sm" className="h-auto p-0 text-atomic" asChild>
                            <Link href="#">Читать</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Обсуждения</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Присоединяйтесь к обсуждениям по безопасности смарт-контрактов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {discussions.map((discussion, index) => (
                    <div key={index} className="p-4 rounded-md bg-firmament">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-autumn font-medium">{discussion.title}</h3>
                        <Badge className="bg-autumn/20 text-autumn border-autumn/30">{discussion.category}</Badge>
                      </div>
                      <p className="text-autumn-muted text-sm mb-3">{discussion.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            {discussion.participants.slice(0, 3).map((participant, i) => (
                              <Avatar key={i} className="size-6 border-2 border-firmament">
                                <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                                <AvatarFallback className="bg-atomic text-autumn text-xs">
                                  {participant.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {discussion.participants.length > 3 && (
                              <div className="size-6 rounded-full bg-firmament-lighter flex items-center justify-center text-autumn text-xs">
                                +{discussion.participants.length - 3}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-autumn-muted text-xs">
                            <MessageSquare className="size-3" />
                            <span>{discussion.replies}</span>
                          </div>
                          <span className="text-autumn-muted text-xs">{discussion.lastActivity}</span>
                        </div>
                        <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                          Присоединиться
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" className="border-firmament-lighter text-autumn">
                  Показать больше обсуждений
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Присоединяйтесь к сообществу</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Станьте частью сообщества безопасности смарт-контрактов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="p-6 rounded-md bg-firmament flex flex-col items-center text-center">
                    <Users className="size-12 text-atomic mb-4" />
                    <h3 className="text-autumn font-medium mb-2">Форум</h3>
                    <p className="text-autumn-muted text-sm mb-4">
                      Обсуждайте вопросы безопасности с экспертами и разработчиками
                    </p>
                    <Button className="w-full bg-atomic hover:bg-atomic/90">Перейти на форум</Button>
                  </div>
                  <div className="p-6 rounded-md bg-firmament flex flex-col items-center text-center">
                    <MessageSquare className="size-12 text-atomic mb-4" />
                    <h3 className="text-autumn font-medium mb-2">Discord</h3>
                    <p className="text-autumn-muted text-sm mb-4">
                      Присоединяйтесь к нашему Discord-серверу для общения в реальном времени
                    </p>
                    <Button className="w-full bg-atomic hover:bg-atomic/90">Присоединиться к Discord</Button>
                  </div>
                  <div className="p-6 rounded-md bg-firmament flex flex-col items-center text-center">
                    <GitPullRequest className="size-12 text-atomic mb-4" />
                    <h3 className="text-autumn font-medium mb-2">GitHub</h3>
                    <p className="text-autumn-muted text-sm mb-4">
                      Вносите свой вклад в открытые инструменты и библиотеки безопасности
                    </p>
                    <Button className="w-full bg-atomic hover:bg-atomic/90">Перейти на GitHub</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Примеры данных
const topContributors = [
  {
    name: "Алексей Иванов",
    avatar: "/placeholder.svg?height=40&width=40",
    contributions: 42,
    level: "Эксперт",
  },
  {
    name: "Мария Петрова",
    avatar: "/placeholder.svg?height=40&width=40",
    contributions: 36,
    level: "Эксперт",
  },
  {
    name: "Дмитрий Сидоров",
    avatar: "/placeholder.svg?height=40&width=40",
    contributions: 28,
    level: "Продвинутый",
  },
  {
    name: "Елена Козлова",
    avatar: "/placeholder.svg?height=40&width=40",
    contributions: 21,
    level: "Продвинутый",
  },
  {
    name: "Игорь Смирнов",
    avatar: "/placeholder.svg?height=40&width=40",
    contributions: 15,
    level: "Продвинутый",
  },
]

const recentContributions = [
  {
    title: "MEV-защищенные транзакции в DeFi",
    type: "Исследование",
    date: "2 часа назад",
    status: "Опубликовано",
    description: "Анализ методов защиты от фронтраннинга и сэндвич-атак в децентрализованных финансовых протоколах.",
    author: {
      name: "Алексей Иванов",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    title: "Уязвимость в механизме стейкинга",
    type: "Уязвимость",
    date: "5 часов назад",
    status: "На проверке",
    description:
      "Обнаружена новая уязвимость в механизмах стейкинга, которая может привести к потере вознаграждений пользователей.",
    author: {
      name: "Мария Петрова",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    title: "Безопасный шаблон для NFT-маркетплейса",
    type: "Шаблон",
    date: "1 день назад",
    status: "Опубликовано",
    description:
      "Шаблон смарт-контракта для NFT-маркетплейса с защитой от распространенных уязвимостей и оптимизированным расходом газа.",
    author: {
      name: "Дмитрий Сидоров",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]

const discussions = [
  {
    title: "Безопасность мостов между блокчейнами",
    category: "Архитектура",
    description: "Обсуждение архитектурных решений для повышения безопасности мостов между различными блокчейнами.",
    participants: [
      { name: "Алексей Иванов", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Мария Петрова", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Дмитрий Сидоров", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Елена Козлова", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Игорь Смирнов", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    replies: 24,
    lastActivity: "30 минут назад",
  },
  {
    title: "Анализ последних DeFi-взломов",
    category: "Исследования",
    description:
      "Разбор недавних взломов DeFi-протоколов, анализ использованных уязвимостей и методов их предотвращения.",
    participants: [
      { name: "Мария Петрова", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Дмитрий Сидоров", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Елена Козлова", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    replies: 18,
    lastActivity: "2 часа назад",
  },
  {
    title: "Формальная верификация смарт-контрактов",
    category: "Методология",
    description:
      "Обсуждение инструментов и методов формальной верификации смарт-контрактов для обеспечения их безопасности.",
    participants: [
      { name: "Алексей Иванов", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Игорь Смирнов", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    replies: 12,
    lastActivity: "1 день назад",
  },
]
