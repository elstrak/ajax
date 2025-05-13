// app/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Zap } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SessionNavBar } from "@/components/session-nav-bar"
import { dashboardService } from "@/services/api"
import { DashboardStats, RecentScan, TopVulnerability } from "@/services/api/dashboardService"

export default function Dashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentScans, setRecentScans] = useState<RecentScan[]>([])
  const [topVulnerabilities, setTopVulnerabilities] = useState<TopVulnerability[]>([])

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        
        // Загружаем все данные параллельно
        const [statsData, recentScansData, topVulnerabilitiesData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentScans(),
          dashboardService.getTopVulnerabilities()
        ])
        
        setStats(statsData)
        setRecentScans(recentScansData.recentScans)
        setTopVulnerabilities(topVulnerabilitiesData.topVulnerabilities)
        
      } catch (error) {
        console.error("Ошибка при загрузке данных дашборда:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

  // Обработчик для кнопки нового сканирования
  const handleNewScan = () => {
    router.push("/analyze")
  }

  // Обработчик для просмотра сканирования
  const handleViewScan = (scanId: string) => {
    router.push(`/history/${scanId}`)
  }

  // Обработчик для просмотра информации о уязвимости
  const handleViewVulnerability = (vulnName: string) => {
    router.push(`/knowledge?search=${encodeURIComponent(vulnName)}`)
  }

  // Вспомогательная функция для цветов серьезности
  const getSeverityColor = (severity: string): string => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "text-demonic"
      case "high":
        return "text-demonic"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-autumn-muted"
    }
  }

  // Индикатор загрузки
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-firmament">
        <SessionNavBar />
        <div className="flex-1 p-6 md:p-8 ml-[3.05rem] flex items-center justify-center">
          <div className="text-autumn-muted">Загрузка данных...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-firmament">
      {/* Sidebar */}
      <SessionNavBar />

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 ml-[3.05rem]">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-autumn">Панель управления</h1>
            <p className="text-autumn-muted">Добро пожаловать в рабочее пространство безопасности смарт-контрактов</p>
          </div>
          <Button className="bg-demonic hover:bg-demonic/90" onClick={handleNewScan}>
            <Zap className="mr-2 h-4 w-4" />
            Новое сканирование
          </Button>
        </header>

        {/* Overview Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card className="bg-firmament-light border-firmament-lighter">
            <CardHeader className="pb-2">
              <CardTitle className="text-autumn">Всего сканирований</CardTitle>
              <CardDescription className="text-autumn-muted">Ваши сканирования</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-autumn">{stats?.totalScans || 0}</div>
              {/* Можно добавить динамический расчет изменения, если API будет его возвращать */}
              {/* <p className="text-sm text-atomic">+12% с прошлого месяца</p> */}
            </CardContent>
          </Card>
          <Card className="bg-firmament-light border-firmament-lighter">
            <CardHeader className="pb-2">
              <CardTitle className="text-autumn">Уязвимости</CardTitle>
              <CardDescription className="text-autumn-muted">Обнаружены проблемы</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-demonic">{stats?.totalVulnerabilities || 0}</div>
              {/* Здесь можно добавить разбивку по типам критичности, если API будет её возвращать */}
            </CardContent>
          </Card>
          <Card className="bg-firmament-light border-firmament-lighter">
            <CardHeader className="pb-2">
              <CardTitle className="text-autumn">Оценка безопасности</CardTitle>
              <CardDescription className="text-autumn-muted">Средняя по проектам</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-atomic">{stats?.averageSecurityScore || 0}%</div>
              <Progress value={stats?.averageSecurityScore || 0} className="h-2 bg-firmament-lighter">
                <div 
                  className="h-full bg-atomic rounded-full" 
                  style={{ width: `${stats?.averageSecurityScore || 0}%` }} 
                />
              </Progress>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="recent" className="mb-8">
          <TabsList className="bg-firmament-light">
            <TabsTrigger value="recent" className="text-autumn data-[state=active]:bg-firmament-lighter">
              Недавние сканирования
            </TabsTrigger>
            <TabsTrigger value="vulnerabilities" className="text-autumn data-[state=active]:bg-firmament-lighter">
              Основные уязвимости
            </TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="mt-4">
            <Card className="bg-firmament-light border-firmament-lighter">
              <CardContent className="p-0">
                <div className="divide-y divide-firmament-lighter">
                  {recentScans.length > 0 ? (
                    recentScans.map((scan) => (
                      <div key={scan._id} className="flex items-center justify-between p-4">
                        <div>
                          <div className="font-medium text-autumn">
                            {scan.fileName || scan.contractAddress || 'Безымянное сканирование'}
                          </div>
                          <div className="text-sm text-autumn-muted">
                            {new Date(scan.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`text-sm ${scan.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                            {scan.status === 'completed' ? 'Завершено' : 'В процессе'}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-firmament-lighter text-autumn"
                            onClick={() => handleViewScan(scan._id)}
                          >
                            Просмотр
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-autumn-muted">
                      У вас пока нет сканирований. Нажмите "Новое сканирование", чтобы начать.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="vulnerabilities" className="mt-4">
            <Card className="bg-firmament-light border-firmament-lighter">
              <CardContent className="p-0">
                <div className="divide-y divide-firmament-lighter">
                  {topVulnerabilities.length > 0 ? (
                    topVulnerabilities.map((vuln) => (
                      <div key={`${vuln.name}-${vuln.category}`} className="flex items-center justify-between p-4">
                        <div>
                          <div className="font-medium text-autumn">{vuln.name}</div>
                          <div className="text-sm text-autumn-muted">{vuln.category}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`text-sm ${getSeverityColor(vuln.severity)}`}>
                            {vuln.severity}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-firmament-lighter text-autumn"
                            onClick={() => handleViewVulnerability(vuln.name)}
                          >
                            Подробности
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-autumn-muted">
                      Информация о уязвимостях отсутствует. Сначала проведите сканирование.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features Section */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-autumn">Возможности анализа</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Распознавание паттернов</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Определяет шаблоны уязвимостей в нескольких контрактах
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-firmament p-4">
                  <code className="text-xs text-autumn-muted">
                    <span className="text-atomic">function</span> <span className="text-demonic">transferFunds</span>
                    (address recipient, uint amount) {"{"}
                    <br />
                    &nbsp;&nbsp;require(balances[msg.sender] &gt;= amount);
                    <br />
                    &nbsp;&nbsp;<span className="text-demonic">// Отсутствует проверка нулевого адреса</span>
                    <br />
                    &nbsp;&nbsp;balances[msg.sender] -= amount;
                    <br />
                    &nbsp;&nbsp;balances[recipient] += amount;
                    <br />
                    {"}"}
                  </code>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Обнаружение аномалий</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Выявляет необычные шаблоны кода, которые могут указывать на уязвимости
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-md bg-firmament p-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-autumn">Риск повторного входа</div>
                    <div className="text-sm text-autumn-muted">Часто встречается в контрактах</div>
                  </div>
                  <div className="text-2xl font-bold text-demonic">87%</div>
                </div>
                <div className="mt-2 flex items-center justify-between rounded-md bg-firmament p-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-autumn">Переполнение целых чисел</div>
                    <div className="text-sm text-autumn-muted">Распространенная проблема</div>
                  </div>
                  <div className="text-2xl font-bold text-atomic">62%</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}