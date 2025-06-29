"use client"

import { ArrowLeft, Code, Download, ExternalLinkIcon, FileText, Share2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SessionNavBar } from "@/components/session-nav-bar"
import { Separator } from "@/components/ui/separator"

interface VulnerabilityDetail {
  name: string;
  type: string;
  severity: string;
  lines: string;
  description: string;
  code: string;
}

interface Analysis {
  id: string;
  name: string;
  address: string;
  date: string;
  rating: number;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  network: string;
  vulnerabilityDetails: VulnerabilityDetail[];
}

export default function HistoryDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [analysis, setAnalysis] = useState<Analysis | null>(null)

  useEffect(() => {
    async function fetchAnalysis() {
      const res = await fetch(`/api/history/${id}`);
      if (res.ok) {
        const data = await res.json();

        // Преобразуем данные из API к нужному формату
        const analysis: Analysis = {
          id: data._id, // или data._id.$oid если приходит так
          name: "VulnerableBank.sol", // или другое имя, если есть
          address: "", // если есть адрес, иначе пусто
          date: new Date(data.createdAt).toLocaleString("ru-RU"), // или другой формат
          rating: (data.securityScore ?? 0) / 10, // если securityScore 55, то 5.5
          vulnerabilities: {
            critical: data.vulnerabilities.filter(v => v.severity === "critical").length,
            high: data.vulnerabilities.filter(v => v.severity === "high").length,
            medium: data.vulnerabilities.filter(v => v.severity === "medium").length,
            low: data.vulnerabilities.filter(v => v.severity === "low").length,
          },
          network: data.network,
          vulnerabilityDetails: data.vulnerabilities.map(v => ({
            name: v.name,
            type: v.category,
            severity: mapSeverity(v.severity), // функция для перевода "critical" → "Критическая"
            lines: "", // если есть информация о строках, иначе пусто
            description: v.description,
            code: "", // если есть пример кода, иначе пусто
          })),
        };

        setAnalysis(analysis);
      } else {
        setAnalysis(null);
      }
    }
    fetchAnalysis();
  }, [id]);

  if (!analysis) {
    return (
      <div className="flex min-h-screen bg-firmament">
        <SessionNavBar />
        <div className="flex-1 p-6 md:p-8 ml-[3.05rem] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-autumn mb-4">Анализ не найден</h1>
            <Button asChild>
              <Link href="/history">Вернуться к истории</Link>
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
            <Link href="/history" className="flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Назад к истории
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-autumn">{analysis.name}</h1>
                <Badge className={`${getRatingBadgeColor(analysis.rating)}`}>Рейтинг: {analysis.rating}/10</Badge>
              </div>
              <p className="text-autumn-muted">{analysis.address}</p>
              <p className="text-autumn-muted text-sm">Проанализирован: {analysis.date}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                <Share2 className="size-4 mr-2" />
                Поделиться
              </Button>
              <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                <Download className="size-4 mr-2" />
                Скачать отчет
              </Button>
              <Button className="bg-atomic hover:bg-atomic/90">Повторный анализ</Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="vulnerabilities" className="w-full">
              <TabsList className="bg-firmament-light">
                <TabsTrigger value="vulnerabilities" className="text-autumn data-[state=active]:bg-firmament-lighter">
                  Уязвимости
                </TabsTrigger>
                <TabsTrigger value="code" className="text-autumn data-[state=active]:bg-firmament-lighter">
                  Код
                </TabsTrigger>
                <TabsTrigger value="fixes" className="text-autumn data-[state=active]:bg-firmament-lighter">
                  Исправления
                </TabsTrigger>
                <TabsTrigger value="tests" className="text-autumn data-[state=active]:bg-firmament-lighter">
                  Тесты
                </TabsTrigger>
              </TabsList>

              <TabsContent value="vulnerabilities" className="mt-6">
                <Card className="bg-firmament-light border-firmament-lighter">
                  <CardHeader>
                    <CardTitle className="text-autumn">Обнаруженные уязвимости</CardTitle>
                    <CardDescription className="text-autumn-muted">
                      Всего найдено: {getTotalVulnerabilities(analysis.vulnerabilities)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {analysis.vulnerabilityDetails.map((vuln, index) => (
                        <div key={index} className="rounded-md border border-firmament-lighter overflow-hidden">
                          <div className={`h-1 w-full ${getSeverityColorBg(vuln.severity)}`} />
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-autumn font-medium">{vuln.name}</h3>
                                <p className="text-autumn-muted text-sm">Строки: {vuln.lines}</p>
                              </div>
                              <Badge className={getSeverityColor(vuln.severity)}>{vuln.severity}</Badge>
                            </div>
                            <p className="text-autumn-muted mb-4">{vuln.description}</p>
                            <div className="rounded-md bg-firmament p-3 mb-4">
                              <pre className="text-xs text-autumn-muted overflow-x-auto">
                                <code>{vuln.code}</code>
                              </pre>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-firmament-lighter text-autumn"
                                asChild
                              >
                                <Link href={`/knowledge/${vuln.type}`}>
                                  <FileText className="mr-2 size-4" />
                                  Подробнее о уязвимости
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                                <Code className="mr-2 size-4" />
                                Показать исправление
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="code" className="mt-6">
                <Card className="bg-firmament-light border-firmament-lighter">
                  <CardHeader>
                    <CardTitle className="text-autumn">Исходный код контракта</CardTitle>
                    <CardDescription className="text-autumn-muted">
                      Полный код проанализированного контракта
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md bg-firmament p-4 overflow-x-auto">
                      <pre className="text-xs text-autumn-muted">
                        <code>
                          {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenSwap {
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
    
    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }
    
    function transfer(address recipient, uint amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // Уязвимость: отсутствует проверка нулевого адреса
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
    }
}`}
                        </code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fixes" className="mt-6">
                <Card className="bg-firmament-light border-firmament-lighter">
                  <CardHeader>
                    <CardTitle className="text-autumn">Предлагаемые исправления</CardTitle>
                    <CardDescription className="text-autumn-muted">
                      Рекомендации по устранению обнаруженных уязвимостей
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-autumn font-medium mb-2">Исправление Reentrancy</h3>
                        <div className="rounded-md bg-firmament p-4 overflow-x-auto">
                          <pre className="text-xs text-autumn-muted">
                            <code>
                              {`function withdraw() public {
    uint bal = balances[msg.sender];
    require(bal > 0);
    
    // Исправление: сначала обновляем баланс, затем отправляем средства
    balances[msg.sender] = 0;
    
    (bool sent, ) = msg.sender.call{value: bal}("");
    require(sent, "Failed to send Ether");
}`}
                            </code>
                          </pre>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-autumn font-medium mb-2">Исправление проверки нулевого адреса</h3>
                        <div className="rounded-md bg-firmament p-4 overflow-x-auto">
                          <pre className="text-xs text-autumn-muted">
                            <code>
                              {`function transfer(address recipient, uint amount) public {
    require(balances[msg.sender] >= amount, "Insufficient balance");
    // Исправление: добавлена проверка нулевого адреса
    require(recipient != address(0), "Cannot transfer to zero address");
    
    balances[msg.sender] -= amount;
    balances[recipient] += amount;
}`}
                            </code>
                          </pre>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-autumn font-medium mb-2">Полный исправленный контракт</h3>
                        <div className="rounded-md bg-firmament p-4 overflow-x-auto">
                          <pre className="text-xs text-autumn-muted">
                            <code>
                              {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TokenSwap is ReentrancyGuard {
    mapping(address => uint) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw() public nonReentrant {
        uint bal = balances[msg.sender];
        require(bal > 0);
        
        // Исправление: сначала обновляем баланс, затем отправляем средства
        balances[msg.sender] = 0;
        
        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");
    }
    
    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }
    
    function transfer(address recipient, uint amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        // Исправление: добавлена проверка нулевого адреса
        require(recipient != address(0), "Cannot transfer to zero address");
        
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
    }
}`}
                            </code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tests" className="mt-6">
                <Card className="bg-firmament-light border-firmament-lighter">
                  <CardHeader>
                    <CardTitle className="text-autumn">Тесты безопасности</CardTitle>
                    <CardDescription className="text-autumn-muted">
                      Автоматически сгенерированные тесты для проверки уязвимостей
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md bg-firmament p-4 overflow-x-auto">
                      <pre className="text-xs text-autumn-muted">
                        <code>
                          {`// SPDX-License-Identifier: MIT
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenSwap Vulnerability Tests", function () {
  let tokenSwap;
  let owner;
  let attacker;
  let user;

  beforeEach(async function () {
    [owner, attacker, user] = await ethers.getSigners();
    
    const TokenSwap = await ethers.getContractFactory("TokenSwap");
    tokenSwap = await TokenSwap.deploy();
    await tokenSwap.deployed();
    
    // Пополнение контракта
    await tokenSwap.deposit({ value: ethers.utils.parseEther("10") });
  });

  it("Тест на уязвимость повторного входа (Reentrancy)", async function () {
    // Развертывание вредоносного контракта
    const AttackerContract = await ethers.getContractFactory("ReentrancyAttacker");
    const attackerContract = await AttackerContract.connect(attacker).deploy(tokenSwap.address);
    
    // Начальный баланс атакующего
    const initialBalance = await ethers.provider.getBalance(attacker.address);
    
    // Атакующий делает депозит
    await attackerContract.connect(attacker).deposit({ value: ethers.utils.parseEther("1") });
    
    // Запуск атаки
    await attackerContract.connect(attacker).attack();
    
    // Конечный баланс атакующего
    const finalBalance = await ethers.provider.getBalance(attacker.address);
    
    // Проверка: атакующий должен получить больше, чем вложил
    expect(finalBalance.sub(initialBalance)).to.be.gt(ethers.utils.parseEther("1"));
  });

  it("Тест на проверку нулевого адреса", async function () {
    // Пополнение баланса пользователя
    await tokenSwap.connect(user).deposit({ value: ethers.utils.parseEther("1") });
    
    // Попытка перевода на нулевой адрес должна завершиться ошибкой
    await expect(
      tokenSwap.connect(user).transfer(ethers.constants.AddressZero, ethers.utils.parseEther("0.5"))
    ).to.be.revertedWith("Cannot transfer to zero address");
  });
});`}
                        </code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Рейтинг безопасности</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center">
                  <div className="relative flex items-center justify-center mb-4">
                    <div className="absolute text-4xl font-bold text-autumn">{analysis.rating}</div>
                    <svg className="size-40" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#1A1F38"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={getRatingCircleColor(analysis.rating)}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="282.7"
                        strokeDashoffset={282.7 - (282.7 * analysis.rating) / 10}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                  <p className="text-autumn-muted text-sm mb-4">из 10 возможных</p>
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-autumn">Критические проблемы</span>
                      <span className="text-demonic">{analysis.vulnerabilities.critical}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-autumn">Высокие риски</span>
                      <span className="text-atomic">{analysis.vulnerabilities.high}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-autumn">Средние риски</span>
                      <span className="text-yellow-500">{analysis.vulnerabilities.medium}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-autumn">Низкие риски</span>
                      <span className="text-green-500">{analysis.vulnerabilities.low}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Информация о контракте</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-autumn-muted text-sm">Адрес контракта</p>
                    <div className="flex items-center gap-2">
                      <p className="text-autumn truncate">{analysis.address}</p>
                      <Button variant="ghost" size="icon" className="size-6">
                        <ExternalLinkIcon className="size-4 text-autumn" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-autumn-muted text-sm">Сеть</p>
                    <p className="text-autumn">{analysis.network}</p>
                  </div>
                  <div>
                    <p className="text-autumn-muted text-sm">Компилятор</p>
                    <p className="text-autumn">Solidity 0.8.4</p>
                  </div>
                  <div>
                    <p className="text-autumn-muted text-sm">Оптимизация</p>
                    <p className="text-autumn">Включена (200 прогонов)</p>
                  </div>
                  <Separator className="bg-firmament-lighter" />
                  <div>
                    <p className="text-autumn-muted text-sm">Размер контракта</p>
                    <p className="text-autumn">4.2 KB</p>
                  </div>
                  <div>
                    <p className="text-autumn-muted text-sm">Количество функций</p>
                    <p className="text-autumn">4</p>
                  </div>
                  <div>
                    <p className="text-autumn-muted text-sm">Количество строк кода</p>
                    <p className="text-autumn">42</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Похожие инциденты</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link
                    href="#"
                    className="flex items-start gap-2 p-2 rounded-md hover:bg-firmament-lighter transition-colors"
                  >
                    <div className="size-1.5 rounded-full bg-demonic mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-autumn font-medium">The DAO Hack (2016)</p>
                      <p className="text-autumn/70 text-sm">Сходство: 85%</p>
                    </div>
                  </Link>
                  <Link
                    href="#"
                    className="flex items-start gap-2 p-2 rounded-md hover:bg-firmament-lighter transition-colors"
                  >
                    <div className="size-1.5 rounded-full bg-atomic mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-autumn font-medium">Uniswap V1 Vulnerability</p>
                      <p className="text-autumn/70 text-sm">Сходство: 62%</p>
                    </div>
                  </Link>
                  <Link
                    href="#"
                    className="flex items-start gap-2 p-2 rounded-md hover:bg-firmament-lighter transition-colors"
                  >
                    <div className="size-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-autumn font-medium">Cream Finance Exploit</p>
                      <p className="text-autumn/70 text-sm">Сходство: 41%</p>
                    </div>
                  </Link>
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
function getAnalysisById(id: string) {
  const analyses = [
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
      vulnerabilityDetails: [
        {
          name: "Reentrancy",
          type: "reentrancy",
          severity: "Критическая",
          lines: "45-52",
          description:
            "Уязвимость повторного входа в функции withdraw(). Внешний вызов происходит до обновления состояния контракта.",
          code: `function withdraw() public {
    uint bal = balances[msg.sender];
    require(bal > 0);
    
    // Уязвимость: отправка средств происходит до обновления баланса
    (bool sent, ) = msg.sender.call{value: bal}("");
    require(sent, "Failed to send Ether");
    
    balances[msg.sender] = 0;
}`,
        },
        {
          name: "Unchecked Return Values",
          type: "unchecked-return",
          severity: "Высокая",
          lines: "78",
          description:
            "Не проверяется возвращаемое значение внешнего вызова, что может привести к неожиданному поведению.",
          code: `// Уязвимый код
someExternalContract.call(data);
// Нет проверки результата вызова`,
        },
        {
          name: "Missing Zero Address Check",
          type: "access-control",
          severity: "Средняя",
          lines: "67",
          description:
            "Отсутствует проверка на нулевой адрес при переводе средств, что может привести к потере средств.",
          code: `function transfer(address recipient, uint amount) public {
    require(balances[msg.sender] >= amount, "Insufficient balance");
    
    // Уязвимость: отсутствует проверка нулевого адреса
    balances[msg.sender] -= amount;
    balances[recipient] += amount;
}`,
        },
      ],
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
      vulnerabilityDetails: [],
    },
    {
      id: "686175335a5a89dcafaad645",
      name: "Test Report",
      address: "0x123...",
      date: "01 янв 2024, 00:00",
      rating: 7.5,
      vulnerabilities: {
        critical: 0,
        high: 1,
        medium: 0,
        low: 0,
      },
      network: "Ethereum",
      vulnerabilityDetails: [],
    },
  ]

  return analyses.find((a) => a.id === id)
}

function getTotalVulnerabilities(vulnerabilities) {
  return vulnerabilities.critical + vulnerabilities.high + vulnerabilities.medium + vulnerabilities.low
}

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

function getRatingBadgeColor(rating) {
  if (rating >= 8) return "bg-green-500/20 text-green-500 border-green-500/30"
  if (rating >= 5) return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
  if (rating >= 3) return "bg-atomic/20 text-atomic border-atomic/30"
  return "bg-demonic/20 text-demonic border-demonic/30"
}

function getRatingCircleColor(rating) {
  if (rating >= 8) return "#22C55E" // green-500
  if (rating >= 5) return "#EAB308" // yellow-500
  if (rating >= 3) return "#FA8603" // atomic
  return "#BB2233" // demonic
}

// Функция для перевода severities
function mapSeverity(severity: string): string {
  switch (severity) {
    case "critical": return "Критическая";
    case "high": return "Высокая";
    case "medium": return "Средняя";
    case "low": return "Низкая";
    default: return severity;
  }
}
