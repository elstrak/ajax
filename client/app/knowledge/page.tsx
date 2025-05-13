import { Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SessionNavBar } from "@/components/session-nav-bar"

export default function KnowledgeBase() {
  return (
    <div className="flex min-h-screen bg-firmament">
      {/* Sidebar */}
      <SessionNavBar />

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 ml-[3.05rem]">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-autumn">База знаний</h1>
          <p className="text-autumn-muted mt-2">
            Изучите распространенные уязвимости смарт-контрактов и методы их предотвращения
          </p>
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-autumn/50" />
            <Input
              placeholder="Поиск по уязвимостям, категориям или ключевым словам..."
              className="pl-10 bg-firmament-light border-firmament-lighter text-autumn"
            />
          </div>
        </header>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="bg-firmament-light mb-6">
            <TabsTrigger value="all" className="text-autumn data-[state=active]:bg-firmament-lighter">
              Все категории
            </TabsTrigger>
            <TabsTrigger value="critical" className="text-autumn data-[state=active]:bg-firmament-lighter">
              Критические
            </TabsTrigger>
            <TabsTrigger value="high" className="text-autumn data-[state=active]:bg-firmament-lighter">
              Высокие
            </TabsTrigger>
            <TabsTrigger value="medium" className="text-autumn data-[state=active]:bg-firmament-lighter">
              Средние
            </TabsTrigger>
            <TabsTrigger value="low" className="text-autumn data-[state=active]:bg-firmament-lighter">
              Низкие
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            {/* Featured Vulnerabilities */}
            <section>
              <h2 className="text-xl font-bold text-autumn mb-4">Популярные уязвимости</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {featuredVulnerabilities.map((vuln, index) => (
                  <Card key={index} className="bg-firmament-light border-firmament-lighter overflow-hidden">
                    <div className={`h-1.5 w-full ${getSeverityColorBg(vuln.severity)}`} />
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-autumn">{vuln.name}</CardTitle>
                        <Badge className={getSeverityColor(vuln.severity)}>{vuln.severity}</Badge>
                      </div>
                      <CardDescription className="text-autumn-muted">{vuln.shortDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-autumn/80 text-sm">{vuln.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full border-firmament-lighter text-autumn hover:bg-firmament-lighter"
                      >
                        Подробнее
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>

            {/* Categories */}
            <section>
              <h2 className="text-xl font-bold text-autumn mb-4">Категории уязвимостей</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {categories.map((category, index) => (
                  <Card key={index} className="bg-firmament-light border-firmament-lighter">
                    <CardHeader>
                      <CardTitle className="text-autumn">{category.name}</CardTitle>
                      <CardDescription className="text-autumn-muted">{category.count} уязвимостей</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full border-firmament-lighter text-autumn hover:bg-firmament-lighter"
                      >
                        Просмотреть
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>

            {/* All Vulnerabilities */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-autumn">Все уязвимости</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-firmament-lighter text-autumn hover:bg-firmament-lighter"
                  >
                    Новые
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-firmament-lighter text-autumn hover:bg-firmament-lighter"
                  >
                    По алфавиту
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-firmament-lighter text-autumn hover:bg-firmament-lighter"
                  >
                    По серьезности
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allVulnerabilities.map((vuln, index) => (
                  <Link href={`/knowledge/${vuln.id}`} key={index}>
                    <Card className="bg-firmament-light border-firmament-lighter h-full hover:border-atomic transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-autumn text-lg">{vuln.name}</CardTitle>
                          <Badge className={getSeverityColor(vuln.severity)}>{vuln.severity}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-autumn/80 text-sm line-clamp-2">{vuln.shortDescription}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            {/* Educational Resources */}
            <section>
              <h2 className="text-xl font-bold text-autumn mb-4">Образовательные ресурсы</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-firmament-light border-firmament-lighter">
                  <CardHeader>
                    <CardTitle className="text-autumn">Руководства по безопасности</CardTitle>
                    <CardDescription className="text-autumn-muted">
                      Пошаговые инструкции по защите смарт-контрактов
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-autumn/80">
                      <li className="flex items-center">
                        <div className="size-1.5 rounded-full bg-atomic mr-2"></div>
                        <span>Лучшие практики аудита смарт-контрактов</span>
                      </li>
                      <li className="flex items-center">
                        <div className="size-1.5 rounded-full bg-atomic mr-2"></div>
                        <span>Защита от атак повторного входа</span>
                      </li>
                      <li className="flex items-center">
                        <div className="size-1.5 rounded-full bg-atomic mr-2"></div>
                        <span>Безопасное управление доступом</span>
                      </li>
                      <li className="flex items-center">
                        <div className="size-1.5 rounded-full bg-atomic mr-2"></div>
                        <span>Предотвращение переполнения целых чисел</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-firmament-lighter text-autumn hover:bg-firmament-lighter"
                    >
                      Все руководства
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="bg-firmament-light border-firmament-lighter">
                  <CardHeader>
                    <CardTitle className="text-autumn">Видеокурсы</CardTitle>
                    <CardDescription className="text-autumn-muted">
                      Обучающие видео по безопасности смарт-контрактов
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-autumn/80">
                      <li className="flex items-center">
                        <div className="size-1.5 rounded-full bg-demonic mr-2"></div>
                        <span>Основы безопасности Solidity</span>
                      </li>
                      <li className="flex items-center">
                        <div className="size-1.5 rounded-full bg-demonic mr-2"></div>
                        <span>Анализ уязвимостей в реальных проектах</span>
                      </li>
                      <li className="flex items-center">
                        <div className="size-1.5 rounded-full bg-demonic mr-2"></div>
                        <span>Инструменты для автоматического аудита</span>
                      </li>
                      <li className="flex items-center">
                        <div className="size-1.5 rounded-full bg-demonic mr-2"></div>
                        <span>Продвинутые техники защиты контрактов</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-firmament-lighter text-autumn hover:bg-firmament-lighter"
                    >
                      Все видеокурсы
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* Other tabs would have similar content but filtered */}
          <TabsContent value="critical" className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-autumn mb-4">Критические уязвимости</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allVulnerabilities
                  .filter((vuln) => vuln.severity === "Критическая")
                  .map((vuln, index) => (
                    <Link href={`/knowledge/${vuln.id}`} key={index}>
                      <Card className="bg-firmament-light border-firmament-lighter h-full hover:border-atomic transition-colors">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-autumn text-lg">{vuln.name}</CardTitle>
                            <Badge className={getSeverityColor(vuln.severity)}>{vuln.severity}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-autumn/80 text-sm line-clamp-2">{vuln.shortDescription}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Примеры данных
const featuredVulnerabilities = [
  {
    name: "Reentrancy",
    severity: "Критическая",
    shortDescription: "Повторный вход в контракт до завершения предыдущего вызова",
    description:
      "Уязвимость, позволяющая атакующему повторно войти в контракт до завершения предыдущего вызова, что может привести к неожиданному поведению, включая кражу средств. Это одна из самых известных уязвимостей, которая привела к взлому The DAO в 2016 году.",
  },
  {
    name: "Integer Overflow/Underflow",
    severity: "Высокая",
    shortDescription: "Арифметические операции, превышающие диапазон типа данных",
    description:
      "Возникает, когда арифметическая операция пытается создать числовое значение, которое выходит за пределы диапазона, который может быть представлен выделенным количеством битов. В Solidity это может привести к неожиданным результатам и потенциальной потере средств.",
  },
  {
    name: "Access Control",
    severity: "Высокая",
    shortDescription: "Недостаточная проверка прав доступа к функциям",
    description:
      "Неправильная реализация контроля доступа может позволить неавторизованным пользователям выполнять привилегированные функции, такие как вывод средств или изменение критических параметров контракта.",
  },
]

const categories = [
  { name: "Логические ошибки", count: 12 },
  { name: "Управление доступом", count: 8 },
  { name: "Арифметические уязвимости", count: 6 },
  { name: "Манипуляции с газом", count: 5 },
  { name: "Фронтраннинг", count: 4 },
  { name: "Уязвимости оракулов", count: 7 },
  { name: "Проблемы рандомизации", count: 3 },
  { name: "Уязвимости DeFi", count: 10 },
]

const allVulnerabilities = [
  {
    id: "reentrancy",
    name: "Reentrancy",
    severity: "Критическая",
    shortDescription: "Повторный вход в контракт до завершения предыдущего вызова",
  },
  {
    id: "integer-overflow",
    name: "Integer Overflow/Underflow",
    severity: "Высокая",
    shortDescription: "Арифметические операции, превышающие диапазон типа данных",
  },
  {
    id: "access-control",
    name: "Access Control",
    severity: "Высокая",
    shortDescription: "Недостаточная проверка прав доступа к функциям",
  },
  {
    id: "front-running",
    name: "Front-Running",
    severity: "Средняя",
    shortDescription: "Манипуляция порядком транзакций для получения выгоды",
  },
  {
    id: "timestamp-dependence",
    name: "Timestamp Dependence",
    severity: "Средняя",
    shortDescription: "Использование block.timestamp для критических операций",
  },
  {
    id: "dos",
    name: "Denial of Service",
    severity: "Высокая",
    shortDescription: "Блокировка функциональности контракта",
  },
  {
    id: "force-sending-ether",
    name: "Force Sending Ether",
    severity: "Низкая",
    shortDescription: "Принудительная отправка ETH в контракт",
  },
  {
    id: "tx-origin",
    name: "tx.origin Authentication",
    severity: "Высокая",
    shortDescription: "Использование tx.origin вместо msg.sender для аутентификации",
  },
  {
    id: "delegate-call",
    name: "Unsafe Delegatecall",
    severity: "Критическая",
    shortDescription: "Небезопасное использование delegatecall",
  },
  {
    id: "default-visibility",
    name: "Default Visibility",
    severity: "Средняя",
    shortDescription: "Неуказанная видимость функций и переменных",
  },
  {
    id: "unchecked-return",
    name: "Unchecked Return Values",
    severity: "Высокая",
    shortDescription: "Игнорирование возвращаемых значений внешних вызовов",
  },
  {
    id: "flash-loan-attack",
    name: "Flash Loan Attack",
    severity: "Критическая",
    shortDescription: "Манипуляция рынком с использованием мгновенных займов",
  },
]

// Вспомогательные функции для цветов
function getSeverityColor(severity) {
  switch (severity) {
    case "Критическая":
      return "bg-demonic/20 text-demonic border-demonic/30"
    case "Высокая":
      return "bg-atomic/20 text-atomic border-atomic/30"
    case "Средняя":
      return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
    case "Низкая":
      return "bg-green-500/20 text-green-500 border-green-500/30"
    default:
      return "bg-autumn/20 text-autumn border-autumn/30"
  }
}

function getSeverityColorBg(severity) {
  switch (severity) {
    case "Критическая":
      return "bg-demonic"
    case "Высокая":
      return "bg-atomic"
    case "Средняя":
      return "bg-yellow-500"
    case "Низкая":
      return "bg-green-500"
    default:
      return "bg-autumn"
  }
}
