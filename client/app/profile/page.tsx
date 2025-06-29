"use client"

import { useState, useEffect } from "react"
import {
  Award,
  BookOpen,
  Calendar,
  Edit,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Mail,
  MapPin,
  Share2,
  Shield,
  Twitter,
  Users,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SessionNavBar } from "@/components/session-nav-bar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { profileService } from "@/services/api"
import type { ProfileData, Contribution } from "@/services/api/profileService"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      profileService.getProfile(),
      profileService.getContributions()
    ])
      .then(([profileData, contributionsData]) => {
        setProfile(profileData)
        setContributions(contributionsData)
        setLoading(false)
      })
      .catch((err) => {
        setError("Ошибка загрузки профиля")
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-8 text-autumn">Загрузка профиля...</div>
  if (error) return <div className="p-8 text-demonic">{error}</div>
  if (!profile) return <div className="p-8 text-demonic">Профиль не найден</div>

  return (
    <div className="flex min-h-screen bg-firmament">
      {/* Sidebar */}
      <SessionNavBar />

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 ml-[3.05rem]">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="size-24 border-4 border-firmament">
                <AvatarImage src={profile.avatar || "/placeholder.svg?height=96&width=96"} alt={profile.name} />
                <AvatarFallback className="bg-atomic text-autumn text-2xl">{profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : ''}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-autumn">{profile.name}</h1>
                <p className="text-autumn-muted">{profile.about || "Профиль пользователя"}</p>
                <div className="flex items-center gap-2 mt-1">
                  {/* Здесь можно добавить бейджи из profile, если они есть */}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-firmament-lighter text-autumn">
                <Share2 className="mr-2 size-4" />
                Поделиться профилем
              </Button>
              <Button className="bg-atomic hover:bg-atomic/90" asChild>
                <Link href="/settings">
                  <Edit className="mr-2 size-4" />
                  Редактировать профиль
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-firmament-light">
                <TabsTrigger value="overview" className="text-autumn data-[state=active]:bg-firmament-lighter">
                  Обзор
                </TabsTrigger>
                {/* <TabsTrigger value="activity" className="text-autumn data-[state=active]:bg-firmament-lighter">
                  Активность
                </TabsTrigger>
                <TabsTrigger value="contributions" className="text-autumn data-[state=active]:bg-firmament-lighter">
                  Вклад
                </TabsTrigger> */}
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                <Card className="bg-firmament-light border-firmament-lighter">
                  <CardHeader>
                    <CardTitle className="text-autumn">О себе</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-autumn-muted">{profile.about || "Информация о пользователе не указана."}</p>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-autumn-muted" />
                        <span className="text-autumn">{profile.city || "Город не указан"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="size-4 text-autumn-muted" />
                        <span className="text-autumn">{profile.contacts?.email || profile.email || "Email не указан"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="size-4 text-autumn-muted" />
                        {profile.website ? (
                          <Link href={profile.website} className="text-atomic hover:underline" target="_blank" rel="noopener noreferrer">
                            {profile.website}
                          </Link>
                        ) : (
                          <span className="text-autumn">Сайт не указан</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-autumn-muted" />
                        <span className="text-autumn">{profile.createdAt ? `Присоединился ${new Date(profile.createdAt).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })}` : "Дата регистрации не указана"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* <Card className="bg-firmament-light border-firmament-lighter">
                  <CardHeader>
                    <CardTitle className="text-autumn">Навыки и экспертиза</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {(profile.skills || []).map((skill, idx) => (
                        <div key={skill + idx}>
                          <div className="flex justify-between mb-1">
                            <span className="text-autumn">{skill}</span>
                          </div>
                          <Progress value={80} className="h-2 bg-firmament-lighter">
                            <div className="h-full bg-atomic rounded-full" style={{ width: "80%" }} />
                          </Progress>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <h3 className="text-autumn font-medium mb-3">Специализации</h3>
                      <div className="flex flex-wrap gap-2">
                        {(profile.specializations || []).map((spec, idx) => (
                          <Badge key={spec + idx} className="bg-firmament border-firmament-lighter text-autumn">{spec}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card> */}

                <Card className="bg-firmament-light border-firmament-lighter">
                  <CardHeader>
                    <CardTitle className="text-autumn">Статистика</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 rounded-md bg-firmament">
                        <p className="text-autumn-muted text-sm mb-1">Проведено анализов</p>
                        <p className="text-autumn text-2xl font-medium">{profile.stats?.analyzes ?? '-'}</p>
                        <p className="text-atomic text-sm">{profile.stats?.analyzesDelta ? `+${profile.stats.analyzesDelta} за последний месяц` : ''}</p>
                      </div>
                      <div className="p-4 rounded-md bg-firmament">
                        <p className="text-autumn-muted text-sm mb-1">Обнаружено уязвимостей</p>
                        <p className="text-autumn text-2xl font-medium">{profile.stats?.vulnerabilities ?? '-'}</p>
                        <p className="text-atomic text-sm">{profile.stats?.vulnerabilitiesDelta ? `+${profile.stats.vulnerabilitiesDelta} за последний месяц` : ''}</p>
                      </div>
                      <div className="p-4 rounded-md bg-firmament">
                        <p className="text-autumn-muted text-sm mb-1">Рейтинг безопасности</p>
                        <p className="text-autumn text-2xl font-medium">{profile.stats?.rating ?? '-'}</p>
                        <p className="text-atomic text-sm">{profile.stats?.ratingNote ?? ''}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* <Card className="bg-firmament-light border-firmament-lighter">
                  <CardHeader>
                    <CardTitle className="text-autumn">Последние публикации</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentPublications.map((publication, index) => (
                        <div key={index} className="p-4 rounded-md bg-firmament">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-autumn font-medium">{publication.title}</h3>
                            <Badge className="bg-autumn/20 text-autumn border-autumn/30">{publication.type}</Badge>
                          </div>
                          <p className="text-autumn-muted text-sm mb-3">{publication.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-autumn-muted text-xs">{publication.date}</span>
                            <Button variant="link" size="sm" className="h-auto p-0 text-atomic" asChild>
                              <Link href="#" className="flex items-center">
                                Читать
                                <ExternalLink className="ml-1 size-3" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-firmament-lighter text-autumn">
                      Все публикации
                    </Button>
                  </CardFooter>
                </Card> */}
              </TabsContent>

              <TabsContent value="activity" className="mt-6 space-y-6">
                <Card className="bg-firmament-light border-firmament-lighter">
                  <CardHeader>
                    <CardTitle className="text-autumn">Недавняя активность</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {activityItems.map((item, index) => (
                        <div key={index} className="relative pl-6 pb-6">
                          <div className="absolute left-0 top-0 size-4 rounded-full bg-atomic"></div>
                          <div className="absolute left-[7px] top-4 bottom-0 w-[2px] bg-firmament-lighter"></div>
                          <div className="mb-1">
                            <span className="text-autumn font-medium">{item.title}</span>
                          </div>
                          <p className="text-autumn-muted text-sm mb-2">{item.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                item.type === "analysis"
                                  ? "bg-atomic/20 text-atomic border-atomic/30"
                                  : item.type === "contribution"
                                    ? "bg-green-500/20 text-green-500 border-green-500/30"
                                    : "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                              }
                            >
                              {item.type === "analysis"
                                ? "Анализ"
                                : item.type === "contribution"
                                  ? "Вклад"
                                  : "Обучение"}
                            </Badge>
                            <span className="text-autumn-muted text-xs">{item.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-firmament-lighter text-autumn">
                      Показать больше
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-firmament-light border-firmament-lighter">
                  <CardHeader>
                    <CardTitle className="text-autumn">Календарь активности</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 rounded-md bg-firmament">
                      <div className="grid grid-cols-12 gap-1">
                        {Array.from({ length: 52 }).map((_, weekIndex) => (
                          <div key={weekIndex} className="flex flex-col gap-1">
                            {Array.from({ length: 7 }).map((_, dayIndex) => {
                              const intensity = Math.random()
                              let bgColor = "bg-firmament-lighter"
                              if (intensity > 0.9) bgColor = "bg-atomic"
                              else if (intensity > 0.7) bgColor = "bg-atomic/70"
                              else if (intensity > 0.5) bgColor = "bg-atomic/40"
                              else if (intensity > 0.3) bgColor = "bg-atomic/20"
                              return <div key={dayIndex} className={`size-3 rounded-sm ${bgColor}`}></div>
                            })}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end items-center gap-2 mt-4">
                        <span className="text-autumn-muted text-xs">Меньше</span>
                        <div className="size-3 rounded-sm bg-firmament-lighter"></div>
                        <div className="size-3 rounded-sm bg-atomic/20"></div>
                        <div className="size-3 rounded-sm bg-atomic/40"></div>
                        <div className="size-3 rounded-sm bg-atomic/70"></div>
                        <div className="size-3 rounded-sm bg-atomic"></div>
                        <span className="text-autumn-muted text-xs">Больше</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contributions" className="mt-6 space-y-6">
                <Card className="bg-firmament-light border-firmament-lighter">
                  <CardHeader>
                    <CardTitle className="text-autumn">Вклад в базу знаний</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {contributions.map((contribution, index) => (
                        <div key={contribution._id} className="p-4 rounded-md bg-firmament">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-autumn font-medium">{contribution.name}</h3>
                            <Badge className="bg-firmament-lighter text-autumn border-firmament-lighter">
                              {contribution.category}
                            </Badge>
                          </div>
                          <p className="text-autumn-muted text-sm mb-3">{contribution.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-autumn-muted text-xs">{contribution.severity}</span>
                              {contribution.references && contribution.references.length > 0 && (
                                <>
                                  <span className="text-autumn-muted text-xs">•</span>
                                  <span className="text-autumn-muted text-xs">{contribution.references[0]}</span>
                                </>
                              )}
                            </div>
                            <Button variant="link" size="sm" className="h-auto p-0 text-atomic" asChild>
                              <Link href="#">Просмотреть</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-firmament-lighter text-autumn">
                      Все материалы
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-firmament-light border-firmament-lighter">
                  <CardHeader>
                    <CardTitle className="text-autumn">Статистика вклада</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 rounded-md bg-firmament">
                        <p className="text-autumn-muted text-sm mb-1">Всего материалов</p>
                        <p className="text-autumn text-2xl font-medium">12</p>
                        <p className="text-atomic text-sm">+3 за последний месяц</p>
                      </div>
                      <div className="p-4 rounded-md bg-firmament">
                        <p className="text-autumn-muted text-sm mb-1">Просмотры</p>
                        <p className="text-autumn text-2xl font-medium">3,456</p>
                        <p className="text-atomic text-sm">+843 за последний месяц</p>
                      </div>
                      <div className="p-4 rounded-md bg-firmament">
                        <p className="text-autumn-muted text-sm mb-1">Рейтинг</p>
                        <p className="text-autumn text-2xl font-medium">4.9/5</p>
                        <p className="text-atomic text-sm">На основе 48 оценок</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-autumn font-medium mb-3">Распределение по типам</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-autumn">Уязвимости</span>
                            <span className="text-autumn">5</span>
                          </div>
                          <div className="h-2 bg-firmament-lighter rounded-full overflow-hidden">
                            <div className="h-full bg-demonic" style={{ width: "42%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-autumn">Исследования</span>
                            <span className="text-autumn">4</span>
                          </div>
                          <div className="h-2 bg-firmament-lighter rounded-full overflow-hidden">
                            <div className="h-full bg-atomic" style={{ width: "33%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-autumn">Шаблоны</span>
                            <span className="text-autumn">3</span>
                          </div>
                          <div className="h-2 bg-firmament-lighter rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: "25%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Контакты</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="size-5 text-autumn-muted" />
                    <span className="text-autumn">{profile.contacts?.email || profile.email || "Email не указан"}</span>
                  </div>
                  <Separator className="bg-firmament-lighter" />
                  <div className="flex items-center gap-3">
                    <Globe className="size-5 text-autumn-muted" />
                    {profile.website ? (
                      <Link href={profile.website} className="text-atomic hover:underline" target="_blank" rel="noopener noreferrer">
                        {profile.website}
                      </Link>
                    ) : (
                      <span className="text-autumn">Сайт не указан</span>
                    )}
                  </div>
                  <Separator className="bg-firmament-lighter" />
                  <div className="flex items-center gap-3">
                    <Twitter className="size-5 text-autumn-muted" />
                    {profile.contacts?.twitter ? (
                      <Link href={`https://twitter.com/${profile.contacts.twitter.replace('@', '')}`} className="text-atomic hover:underline" target="_blank" rel="noopener noreferrer">
                        {profile.contacts.twitter}
                      </Link>
                    ) : (
                      <span className="text-autumn">Twitter не указан</span>
                    )}
                  </div>
                  <Separator className="bg-firmament-lighter" />
                  <div className="flex items-center gap-3">
                    <Github className="size-5 text-autumn-muted" />
                    {profile.contacts?.github ? (
                      <Link href={`https://github.com/${profile.contacts.github.replace('https://github.com/', '')}`} className="text-atomic hover:underline" target="_blank" rel="noopener noreferrer">
                        {profile.contacts.github}
                      </Link>
                    ) : (
                      <span className="text-autumn">GitHub не указан</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Примеры данных
const recentPublications = [
  {
    title: "Анализ уязвимостей в DeFi-протоколах 2023",
    type: "Исследование",
    description:
      "Обзор наиболее распространенных уязвимостей в DeFi-протоколах за 2023 год и методы их предотвращения.",
    date: "15 апр 2023",
  },
  {
    title: "Безопасные паттерны для NFT-маркетплейсов",
    type: "Руководство",
    description:
      "Руководство по безопасной разработке NFT-маркетплейсов с учетом последних стандартов и лучших практик.",
    date: "2 апр 2023",
  },
  {
    title: "Уязвимость в механизме стейкинга: анализ и решение",
    type: "Анализ",
    description:
      "Подробный разбор недавно обнаруженной уязвимости в механизмах стейкинга и рекомендации по ее устранению.",
    date: "20 мар 2023",
  },
]

const activityItems = [
  {
    title: "Проанализирован смарт-контракт TokenSwap.sol",
    description: "Обнаружено 5 уязвимостей, включая 2 критические проблемы безопасности.",
    type: "analysis",
    date: "Сегодня, 14:32",
  },
  {
    title: "Добавлена новая уязвимость в базу знаний",
    description: "Signature Replay Attack - критическая уязвимость в механизме подписи транзакций.",
    type: "contribution",
    date: "Вчера, 09:15",
  },
  {
    title: "Завершен курс по формальной верификации",
    description: "Пройден курс 'Формальная верификация смарт-контрактов' с отличием.",
    type: "learning",
    date: "3 дня назад",
  },
  {
    title: "Проанализирован смарт-контракт LiquidityPool.sol",
    description: "Обнаружено 6 уязвимостей, включая 1 высокую и 3 средней тяжести.",
    type: "analysis",
    date: "5 дней назад",
  },
  {
    title: "Опубликовано исследование по безопасности DeFi",
    description: "Анализ уязвимостей в DeFi-протоколах 2023 - обзор распространенных проблем и решений.",
    type: "contribution",
    date: "1 неделю назад",
  },
]
