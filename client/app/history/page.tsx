"use client"

import { useState, useEffect } from "react"
import { Calendar, Download, ExternalLinkIcon, Eye, Filter, Search, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SessionNavBar } from "@/components/session-nav-bar"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { historyService } from "@/services/api"
import { HistoryScan, HistoryStats } from "@/services/api/historyService"
import { useRouter } from "next/navigation"

export default function HistoryPage() {
  const router = useRouter()
  const [selectedContracts, setSelectedContracts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [timeRange, setTimeRange] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [scans, setScans] = useState<HistoryScan[]>([])
  const [stats, setStats] = useState<HistoryStats | null>(null)
  const [sortBy, setSortBy] = useState("newest")
  const [filters, setFilters] = useState({
    severityCritical: true,
    severityHigh: true,
    severityMedium: true,
    severityLow: true,
    ratingHigh: true,
    ratingMedium: true,
    ratingLow: true
  })

  // Загрузка данных истории и статистики
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setIsLoading(true)
        
        // Получаем данные истории сканирований
        const historyData = await historyService.getScanHistory(1, 20, searchQuery, timeRange);
        setScans(historyData.scans);
        
        // Получаем статистику для вкладки Stats
        const statsData = await historyService.getHistoryStats();
        setStats(statsData);
      } catch (error) {
        console.error("Ошибка при загрузке данных истории:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistoryData();
  }, [searchQuery, timeRange]);

  // Обработка сортировки
  useEffect(() => {
    const sortedScans = [...scans];
    
    switch (sortBy) {
      case "newest":
        sortedScans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        sortedScans.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "rating-high":
        sortedScans.sort((a, b) => b.securityScore - a.securityScore);
        break;
      case "rating-low":
        sortedScans.sort((a, b) => a.securityScore - b.securityScore);
        break;
      case "vulnerabilities":
        sortedScans.sort((a, b) => {
          const totalA = a.vulnerabilities.critical + a.vulnerabilities.high + a.vulnerabilities.medium + a.vulnerabilities.low;
          const totalB = b.vulnerabilities.critical + b.vulnerabilities.high + b.vulnerabilities.medium + b.vulnerabilities.low;
          return totalB - totalA;
        });
        break;
    }
    
    setScans(sortedScans);
  }, [sortBy]);

  // Обработчик переключения выбора
  const toggleContractSelection = (id: string) => {
    if (selectedContracts.includes(id)) {
      setSelectedContracts(selectedContracts.filter((contractId) => contractId !== id));
    } else {
      setSelectedContracts([...selectedContracts, id]);
    }
  };

  // Обработчик для просмотра сканирования
  const handleViewScan = (scanId: string) => {
    router.push(`/history/${scanId}`);
  };

  // Обработчик для скачивания отчета
  const handleDownloadReport = async (scanId: string) => {
    try {
      // Здесь будет логика скачивания отчета
      console.log(`Скачивание отчета для сканирования ${scanId}`);
    } catch (error) {
      console.error("Ошибка при скачивании отчета:", error);
    }
  };

  // Обработчик применения фильтров
  const handleApplyFilters = () => {
    // Создать объект с фильтрами для API
    const apiFilters = {
      severities: [],
      ratingRanges: []
    };
    
    if (filters.severityCritical) apiFilters.severities.push("critical");
    if (filters.severityHigh) apiFilters.severities.push("high");
    if (filters.severityMedium) apiFilters.severities.push("medium");
    if (filters.severityLow) apiFilters.severities.push("low");
    
    if (filters.ratingHigh) apiFilters.ratingRanges.push("high");
    if (filters.ratingMedium) apiFilters.ratingRanges.push("medium");
    if (filters.ratingLow) apiFilters.ratingRanges.push("low");
    
    // Обновить данные на основе фильтров
    fetchFilteredData(apiFilters);
  };

  // Функция для загрузки отфильтрованных данных
  const fetchFilteredData = async (filters: any) => {
    try {
      setIsLoading(true);
      const historyData = await historyService.getScanHistory(1, 20, searchQuery, timeRange, filters);
      setScans(historyData.scans);
    } catch (error) {
      console.error("Ошибка при применении фильтров:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Индикатор загрузки
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-firmament">
        <SessionNavBar />
        <div className="flex-1 p-6 md:p-8 ml-[3.05rem] flex items-center justify-center">
          <div className="text-autumn-muted">Загрузка данных истории...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-firmament">
      {/* Sidebar */}
      <SessionNavBar />

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 ml-[3.05rem]">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-autumn">История анализов</h1>
              <p className="text-autumn-muted mt-2">
                Просмотр и сравнение результатов предыдущих анализов смарт-контрактов
              </p>
            </div>
            <div className="flex gap-2">
              {selectedContracts.length > 0 && (
                <Button variant="outline" className="border-firmament-lighter text-autumn">
                  <Share2 className="mr-2 size-4" />
                  Поделиться ({selectedContracts.length})
                </Button>
              )}
              {selectedContracts.length > 1 && (
                <Button className="bg-atomic hover:bg-atomic/90">Сравнить ({selectedContracts.length})</Button>
              )}
            </div>
          </div>
        </header>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-autumn/50" />
            <Input
              placeholder="Поиск по имени контракта или адресу..."
              className="pl-10 bg-firmament-light border-firmament-lighter text-autumn"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] bg-firmament-light border-firmament-lighter text-autumn">
                <Calendar className="mr-2 size-4" />
                <SelectValue placeholder="Временной период" />
              </SelectTrigger>
              <SelectContent className="bg-firmament-light border-firmament-lighter text-autumn">
                <SelectGroup>
                  <SelectLabel>Период</SelectLabel>
                  <SelectItem value="all">Все время</SelectItem>
                  <SelectItem value="day">Последние 24 часа</SelectItem>
                  <SelectItem value="week">Последняя неделя</SelectItem>
                  <SelectItem value="month">Последний месяц</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-firmament-lighter text-autumn">
                  <Filter className="mr-2 size-4" />
                  Фильтры
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-firmament-light border-firmament-lighter text-autumn">
                <DropdownMenuLabel>Серьезность уязвимостей</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-firmament-lighter" />
                <DropdownMenuCheckboxItem 
                  checked={filters.severityCritical}
                  onCheckedChange={(checked) => setFilters({...filters, severityCritical: !!checked})}
                >
                  Критические
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={filters.severityHigh}
                  onCheckedChange={(checked) => setFilters({...filters, severityHigh: !!checked})}
                >
                  Высокие
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={filters.severityMedium}
                  onCheckedChange={(checked) => setFilters({...filters, severityMedium: !!checked})}
                >
                  Средние
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={filters.severityLow}
                  onCheckedChange={(checked) => setFilters({...filters, severityLow: !!checked})}
                >
                  Низкие
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator className="bg-firmament-lighter" />
                <DropdownMenuLabel>Рейтинг безопасности</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-firmament-lighter" />
                <DropdownMenuCheckboxItem 
                  checked={filters.ratingHigh}
                  onCheckedChange={(checked) => setFilters({...filters, ratingHigh: !!checked})}
                >
                  Высокий (8-10)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={filters.ratingMedium}
                  onCheckedChange={(checked) => setFilters({...filters, ratingMedium: !!checked})}
                >
                  Средний (5-7)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={filters.ratingLow}
                  onCheckedChange={(checked) => setFilters({...filters, ratingLow: !!checked})}
                >
                  Низкий (0-4)
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator className="bg-firmament-lighter" />
                <Button 
                  className="w-full mt-2 bg-atomic hover:bg-atomic/90"
                  onClick={handleApplyFilters}
                >
                  Применить
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="list" className="mb-8">
          <TabsList className="bg-firmament-light mb-6">
            <TabsTrigger value="list" className="text-autumn data-[state=active]:bg-firmament-lighter">
              Список
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-autumn data-[state=active]:bg-firmament-lighter">
              Статистика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader className="pb-0">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-autumn">Результаты анализов ({scans.length})</CardTitle>
                  <Select defaultValue={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px] bg-firmament border-firmament-lighter text-autumn">
                      <SelectValue placeholder="Сортировка" />
                    </SelectTrigger>
                    <SelectContent className="bg-firmament-light border-firmament-lighter text-autumn">
                      <SelectItem value="newest">Сначала новые</SelectItem>
                      <SelectItem value="oldest">Сначала старые</SelectItem>
                      <SelectItem value="rating-high">По рейтингу (выс-низ)</SelectItem>
                      <SelectItem value="rating-low">По рейтингу (низ-выс)</SelectItem>
                      <SelectItem value="vulnerabilities">По кол-ву уязвимостей</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-firmament-lighter overflow-hidden mt-4">
                  <table className="w-full text-autumn">
                    <thead>
                      <tr className="bg-firmament-lighter">
                        <th className="px-4 py-2 w-10">
                          <Checkbox
                            checked={selectedContracts.length === scans.length && scans.length > 0}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedContracts(scans.map((scan) => scan._id));
                              } else {
                                setSelectedContracts([]);
                              }
                            }}
                            className="border-firmament-lighter data-[state=checked]:bg-atomic data-[state=checked]:border-atomic"
                          />
                        </th>
                        <th className="px-4 py-2 text-left">Имя контракта</th>
                        <th className="px-4 py-2 text-left">Дата анализа</th>
                        <th className="px-4 py-2 text-left">Рейтинг</th>
                        <th className="px-4 py-2 text-left">Уязвимости</th>
                        <th className="px-4 py-2 text-left">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-firmament-lighter">
                      {scans.length > 0 ? (
                        scans.map((scan) => (
                          <tr key={scan._id} className="hover:bg-firmament">
                            <td className="px-4 py-3">
                              <Checkbox
                                checked={selectedContracts.includes(scan._id)}
                                onCheckedChange={() => toggleContractSelection(scan._id)}
                                className="border-firmament-lighter data-[state=checked]:bg-atomic data-[state=checked]:border-atomic"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="font-medium">{scan.name || 'Безымянный контракт'}</span>
                                <span className="text-autumn-muted text-xs truncate max-w-[200px]">
                                  {scan.contractAddress || 'Локальный файл'}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {new Date(scan.createdAt).toLocaleString()}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`size-8 rounded-full flex items-center justify-center font-medium ${getRatingColor(
                                    scan.securityScore / 10,
                                  )}`}
                                >
                                  {Math.round(scan.securityScore / 10)}
                                </div>
                                <div className="w-16">
                                  <Progress value={scan.securityScore} className="h-1.5 bg-firmament-lighter">
                                    <div
                                      className={`h-full rounded-full ${getRatingProgressColor(scan.securityScore / 10)}`}
                                      style={{ width: `${scan.securityScore}%` }}
                                    />
                                  </Progress>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1.5">
                                {scan.vulnerabilities.critical > 0 && (
                                  <Badge className="bg-demonic/20 text-demonic border-demonic/30">
                                    {scan.vulnerabilities.critical}
                                  </Badge>
                                )}
                                {scan.vulnerabilities.high > 0 && (
                                  <Badge className="bg-atomic/20 text-atomic border-atomic/30">
                                    {scan.vulnerabilities.high}
                                  </Badge>
                                )}
                                {scan.vulnerabilities.medium > 0 && (
                                  <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                                    {scan.vulnerabilities.medium}
                                  </Badge>
                                )}
                                {scan.vulnerabilities.low > 0 && (
                                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                                    {scan.vulnerabilities.low}
                                  </Badge>
                                )}
                                {scan.vulnerabilities.critical === 0 &&
                                  scan.vulnerabilities.high === 0 &&
                                  scan.vulnerabilities.medium === 0 &&
                                  scan.vulnerabilities.low === 0 && (
                                    <span className="text-autumn-muted text-sm">Нет</span>
                                  )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleViewScan(scan._id)}>
                                  <Eye className="size-4 text-autumn" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDownloadReport(scan._id)}
                                >
                                  <Download className="size-4 text-autumn" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Share2 className="size-4 text-autumn" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-4 py-6 text-center text-autumn-muted">
                            У вас пока нет сканирований. Перейдите на страницу "Анализ", чтобы начать.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-firmament-light border-firmament-lighter">
                <CardHeader>
                  <CardTitle className="text-autumn">Тренды безопасности</CardTitle>
                  <CardDescription className="text-autumn-muted">
                    Средний рейтинг безопасности за последние 30 дней
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-end justify-between gap-1 pt-6">
                    {stats?.securityTrends?.map((trend, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className={`w-6 ${getRatingBarColor(trend.rating)}`}
                          style={{ height: `${trend.rating * 20}px` }}
                        ></div>
                        <span className="text-autumn-muted text-xs mt-2">{trend.day}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4">
                    <div>
                      <p className="text-autumn-muted text-xs">Средний рейтинг</p>
                      <p className="text-autumn text-lg font-medium">
                        {stats?.securityTrends ? 
                          (stats.securityTrends.reduce((acc, curr) => acc + curr.rating, 0) / stats.securityTrends.length).toFixed(1) : 
                          "0.0"
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-autumn-muted text-xs">Тренд</p>
                      <p className="text-atomic text-lg font-medium">
                        {stats?.securityTrends && stats.securityTrends.length > 1 ? 
                          ((stats.securityTrends[stats.securityTrends.length - 1].rating - 
                            stats.securityTrends[0].rating)).toFixed(1) :
                          "0.0"
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-autumn-muted text-xs">Всего анализов</p>
                      <p className="text-autumn text-lg font-medium">{scans.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-firmament-light border-firmament-lighter">
                <CardHeader>
                  <CardTitle className="text-autumn">Распределение уязвимостей</CardTitle>
                  <CardDescription className="text-autumn-muted">
                    Типы обнаруженных уязвимостей за последние 30 дней
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.vulnerabilityDistribution?.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-autumn">{item.name}</span>
                          <span className="text-autumn">{item.percentage}%</span>
                        </div>
                        <div className="h-2 bg-firmament-lighter rounded-full overflow-hidden">
                          <div className={`h-full ${getVulnerabilityBarColor(item.name)}`} style={{ width: `${item.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                    
                    {(!stats?.vulnerabilityDistribution || stats.vulnerabilityDistribution.length === 0) && (
                      <div className="text-center text-autumn-muted py-4">
                        Нет данных о распределении уязвимостей
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-firmament-light border-firmament-lighter">
                <CardHeader>
                  <CardTitle className="text-autumn">Активность по сетям</CardTitle>
                  <CardDescription className="text-autumn-muted">
                    Распределение анализов по блокчейн-сетям
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {stats?.networkActivity?.map((item, index) => (
                      <div key={index} className="flex flex-col items-center justify-center p-4 bg-firmament rounded-md">
                        <div className={`size-16 rounded-full border-4 ${getNetworkBorderColor(item.network)} flex items-center justify-center mb-2`}>
                          <span className="text-autumn text-lg font-bold">{item.percentage}%</span>
                        </div>
                        <span className="text-autumn font-medium">{item.network}</span>
                      </div>
                    ))}
                    
                    {(!stats?.networkActivity || stats.networkActivity.length === 0) && (
                      <div className="col-span-2 text-center text-autumn-muted py-4">
                        Нет данных об активности по сетям
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-firmament-light border-firmament-lighter">
                <CardHeader>
                  <CardTitle className="text-autumn">Последние инциденты</CardTitle>
                  <CardDescription className="text-autumn-muted">
                    Недавние инциденты безопасности в блокчейн-пространстве
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-md bg-firmament">
                      <div className="size-2 rounded-full bg-demonic mt-1.5"></div>
                      <div>
                        <div className="flex justify-between">
                          <p className="text-autumn font-medium">Euler Finance Hack</p>
                          <p className="text-autumn-muted text-xs">2 дня назад</p>
                        </div>
                        <p className="text-autumn-muted text-sm mt-1">
                          Потеря $197M из-за уязвимости в механизме кредитования
                        </p>
                        <Button variant="link" size="sm" className="h-auto p-0 text-atomic" asChild>
                          <Link href="#" className="flex items-center mt-1">
                            Подробнее
                            <ExternalLinkIcon className="ml-1 size-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-md bg-firmament">
                      <div className="size-2 rounded-full bg-atomic mt-1.5"></div>
                      <div>
                        <div className="flex justify-between">
                          <p className="text-autumn font-medium">Multichain Bridge Exploit</p>
                          <p className="text-autumn-muted text-xs">5 дней назад</p>
                        </div>
                        <p className="text-autumn-muted text-sm mt-1">
                          Уязвимость в мостовом контракте привела к потере $126M
                        </p>
                        <Button variant="link" size="sm" className="h-auto p-0 text-atomic" asChild>
                          <Link href="#" className="flex items-center mt-1">
                            Подробнее
                            <ExternalLinkIcon className="ml-1 size-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-md bg-firmament">
                      <div className="size-2 rounded-full bg-yellow-500 mt-1.5"></div>
                      <div>
                        <div className="flex justify-between">
                          <p className="text-autumn font-medium">Nomad Bridge Hack</p>
                          <p className="text-autumn-muted text-xs">1 неделя назад</p>
                        </div>
                        <p className="text-autumn-muted text-sm mt-1">
                          Ошибка в обновлении контракта позволила вывести $190M
                        </p>
                        <Button variant="link" size="sm" className="h-auto p-0 text-atomic" asChild>
                          <Link href="#" className="flex items-center mt-1">
                            Подробнее
                            <ExternalLinkIcon className="ml-1 size-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Примеры данных
const historyData = [
  {
    id: "1",
    name: "TokenSwap.sol",
    address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    date: "15 апр 2023, 14:32",
    rating: 4.2,
    vulnerabilities: {
      critical: 2,
      high: 1,
      medium: 2,
      low: 0,
    },
    network: "Ethereum",
  },
  {
    id: "2",
    name: "LiquidityPool.sol",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    date: "14 апр 2023, 09:15",
    rating: 6.8,
    vulnerabilities: {
      critical: 0,
      high: 1,
      medium: 3,
      low: 2,
    },
    network: "Ethereum",
  },
  {
    id: "3",
    name: "StakingContract.sol",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    date: "12 апр 2023, 16:45",
    rating: 8.5,
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 1,
      low: 3,
    },
    network: "Polygon",
  },
  {
    id: "4",
    name: "NFTMarketplace.sol",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    date: "10 апр 2023, 11:20",
    rating: 3.7,
    vulnerabilities: {
      critical: 1,
      high: 2,
      medium: 1,
      low: 4,
    },
    network: "BSC",
  },
  {
    id: "5",
    name: "DEXRouter.sol",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    date: "8 апр 2023, 15:10",
    rating: 7.2,
    vulnerabilities: {
      critical: 0,
      high: 1,
      medium: 1,
      low: 1,
    },
    network: "Ethereum",
  },
  {
    id: "6",
    name: "Governance.sol",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    date: "5 апр 2023, 10:05",
    rating: 9.1,
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 2,
    },
    network: "Arbitrum",
  },
  {
    id: "7",
    name: "FlashLoan.sol",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    date: "3 апр 2023, 13:40",
    rating: 5.6,
    vulnerabilities: {
      critical: 0,
      high: 2,
      medium: 1,
      low: 0,
    },
    network: "Optimism",
  },
  {
    id: "8",
    name: "Vault.sol",
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    date: "1 апр 2023, 09:30",
    rating: 6.3,
    vulnerabilities: {
      critical: 0,
      high: 1,
      medium: 2,
      low: 1,
    },
    network: "BSC",
  },
]

const securityTrends = [
  { day: "1", rating: 6.8 },
  { day: "2", rating: 7.1 },
  { day: "3", rating: 6.9 },
  { day: "4", rating: 7.2 },
  { day: "5", rating: 7.0 },
  { day: "6", rating: 7.3 },
  { day: "7", rating: 7.5 },
  { day: "8", rating: 7.2 },
  { day: "9", rating: 7.4 },
  { day: "10", rating: 7.6 },
  { day: "11", rating: 7.3 },
  { day: "12", rating: 7.1 },
  { day: "13", rating: 7.0 },
  { day: "14", rating: 7.2 },
  { day: "15", rating: 7.5 },
  { day: "16", rating: 7.7 },
  { day: "17", rating: 7.4 },
  { day: "18", rating: 7.2 },
  { day: "19", rating: 7.3 },
  { day: "20", rating: 7.1 },
  { day: "21", rating: 7.0 },
  { day: "22", rating: 6.8 },
  { day: "23", rating: 6.9 },
  { day: "24", rating: 7.1 },
  { day: "25", rating: 7.3 },
  { day: "26", rating: 7.5 },
  { day: "27", rating: 7.2 },
  { day: "28", rating: 7.0 },
  { day: "29", rating: 7.1 },
  { day: "30", rating: 7.2 },
]

// Вспомогательные функции для цветов
function getRatingColor(rating) {
  if (rating >= 8) return "bg-green-500/20 text-green-500"
  if (rating >= 5) return "bg-yellow-500/20 text-yellow-500"
  if (rating >= 3) return "bg-atomic/20 text-atomic"
  return "bg-demonic/20 text-demonic"
}

function getRatingProgressColor(rating) {
  if (rating >= 8) return "bg-green-500"
  if (rating >= 5) return "bg-yellow-500"
  if (rating >= 3) return "bg-atomic"
  return "bg-demonic"
}

function getRatingBarColor(rating) {
  if (rating >= 8) return "bg-green-500"
  if (rating >= 5) return "bg-yellow-500"
  if (rating >= 3) return "bg-atomic"
  return "bg-demonic"
}

function getVulnerabilityBarColor(name) {
  switch (name) {
    case "Reentrancy":
      return "bg-demonic"
    case "Access Control":
      return "bg-atomic"
    case "Integer Overflow":
      return "bg-yellow-500"
    case "Unchecked Return Values":
      return "bg-atomic"
    case "Front-Running":
      return "bg-yellow-500"
    default:
      return "bg-green-500"
  }
}

function getNetworkBorderColor(network) {
  switch (network) {
    case "Ethereum":
      return "border-atomic"
    case "BSC":
      return "border-yellow-500"
    case "Polygon":
      return "border-demonic"
    case "Arbitrum":
      return "border-green-500"
    case "Optimism":
      return "border-green-500"
    default:
      return "border-firmament"
  }
}

function ExternalLink(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" x2="21" y1="14" y2="3" />
    </svg>
  )
}
