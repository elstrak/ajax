"use client"

import { useState, useEffect } from "react"
import { Bell, Globe, Key, Lock, Moon, Palette, Shield, User, Wallet, Plus, FileText, Code } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { SessionNavBar } from "@/components/session-nav-bar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { profileService } from "@/services/api"
import type { ProfileData } from "@/services/api/profileService"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [form, setForm] = useState<Partial<ProfileData>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    profileService.getProfile()
      .then((data) => {
        setProfile(data)
        setForm(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Ошибка загрузки профиля")
        setLoading(false)
      })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const updated = await profileService.updateProfile(form)
      setProfile(updated)
      setSuccess("Профиль успешно обновлен")
    } catch {
      setError("Ошибка сохранения профиля")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-autumn">Загрузка профиля...</div>
  if (error) return <div className="p-8 text-demonic">{error}</div>
  if (!profile) return <div className="p-8 text-demonic">Профиль не найден</div>

  return (
    <div className="flex min-h-screen bg-firmament">
      {/* Sidebar */}
      <SessionNavBar />

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 ml-[3.05rem]">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-autumn">Настройки</h1>
          <p className="text-autumn-muted mt-2">Управление настройками аккаунта и приложения</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-firmament-light mb-6">
            <TabsTrigger value="account" className="text-autumn data-[state=active]:bg-firmament-lighter">
              <User className="mr-2 size-4" />
              Аккаунт
            </TabsTrigger>
            {/* <TabsTrigger value="security" className="text-autumn data-[state=active]:bg-firmament-lighter">
              <Shield className="mr-2 size-4" />
              Безопасность
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-autumn data-[state=active]:bg-firmament-lighter">
              <Bell className="mr-2 size-4" />
              Уведомления
            </TabsTrigger>
            <TabsTrigger value="appearance" className="text-autumn data-[state=active]:bg-firmament-lighter">
              <Palette className="mr-2 size-4" />
              Внешний вид
            </TabsTrigger>
            <TabsTrigger value="wallet" className="text-autumn data-[state=active]:bg-firmament-lighter">
              <Wallet className="mr-2 size-4" />
              Кошелек
            </TabsTrigger>
            <TabsTrigger value="api" className="text-autumn data-[state=active]:bg-firmament-lighter">
              <Key className="mr-2 size-4" />
              API
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Основная информация</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Обновите основную информацию вашего аккаунта
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSave}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-autumn">Имя</Label>
                      <Input
                        id="name"
                        name="name"
                        value={form.name || ''}
                        onChange={handleChange}
                        className="bg-firmament border-firmament-lighter text-autumn"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-autumn">Город</Label>
                      <Input
                        id="city"
                        name="city"
                        value={form.city || ''}
                        onChange={handleChange}
                        className="bg-firmament border-firmament-lighter text-autumn"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-autumn">Email</Label>
                    <Input
                      id="email"
                      name="contacts.email"
                      value={form.contacts?.email || ''}
                      onChange={e => setForm(f => ({ ...f, contacts: { ...f.contacts, email: e.target.value } }))}
                      className="bg-firmament border-firmament-lighter text-autumn"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-autumn">Сайт</Label>
                    <Input
                      id="website"
                      name="website"
                      value={form.website || ''}
                      onChange={handleChange}
                      className="bg-firmament border-firmament-lighter text-autumn"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-autumn">О себе</Label>
                    <Textarea
                      id="bio"
                      name="about"
                      value={form.about || ''}
                      onChange={handleChange}
                      className="min-h-[100px] bg-firmament border-firmament-lighter text-autumn"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-atomic hover:bg-atomic/90" type="submit" disabled={saving}>{saving ? "Сохранение..." : "Сохранить изменения"}</Button>
                  </div>
                  {success && <div className="text-green-600 mt-2">{success}</div>}
                  {error && <div className="text-demonic mt-2">{error}</div>}
                </form>
              </CardContent>
            </Card>

            {/* <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Настройки профиля</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Управление настройками видимости профиля
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-autumn font-medium">Публичный профиль</p>
                      <p className="text-autumn-muted text-sm">
                        Разрешить другим пользователям видеть ваш профиль и активность
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-firmament-lighter" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-autumn font-medium">Показывать статистику</p>
                      <p className="text-autumn-muted text-sm">Отображать вашу статистику в публичном профиле</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-firmament-lighter" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-autumn font-medium">Показывать контакты</p>
                      <p className="text-autumn-muted text-sm">Разрешить другим пользователям видеть ваши контакты</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Удаление аккаунта</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Удаление аккаунта приведет к потере всех данных
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-md bg-demonic/10 border border-demonic/20 mb-4">
                  <p className="text-autumn">
                    Внимание! Удаление аккаунта - необратимое действие. Все ваши данные, включая историю анализов,
                    материалы и настройки, будут безвозвратно удалены.
                  </p>
                </div>
                <Button variant="destructive" className="bg-demonic hover:bg-demonic/90">
                  Удалить аккаунт
                </Button>
              </CardContent>
            </Card> */}
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Изменение пароля</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Обновите пароль для повышения безопасности аккаунта
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-autumn">
                      Текущий пароль
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      className="bg-firmament border-firmament-lighter text-autumn"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-autumn">
                      Новый пароль
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      className="bg-firmament border-firmament-lighter text-autumn"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-autumn">
                      Подтверждение пароля
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      className="bg-firmament border-firmament-lighter text-autumn"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-atomic hover:bg-atomic/90">Изменить пароль</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Двухфакторная аутентификация</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Повысьте безопасность аккаунта с помощью двухфакторной аутентификации
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-autumn font-medium">Двухфакторная аутентификация</p>
                      <p className="text-autumn-muted text-sm">
                        Требовать дополнительный код при входе в аккаунт для повышения безопасности
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-firmament-lighter" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-autumn font-medium">Метод аутентификации</p>
                      <p className="text-autumn-muted text-sm">Выберите предпочтительный метод аутентификации</p>
                    </div>
                    <Select defaultValue="app">
                      <SelectTrigger className="w-[200px] bg-firmament border-firmament-lighter text-autumn">
                        <SelectValue placeholder="Выберите метод" />
                      </SelectTrigger>
                      <SelectContent className="bg-firmament-light border-firmament-lighter text-autumn">
                        <SelectItem value="app">Приложение-аутентификатор</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="border-firmament-lighter text-autumn">
                    Настроить двухфакторную аутентификацию
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Сессии</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Управление активными сессиями и устройствами
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-md bg-firmament">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-autumn font-medium">Текущая сессия</p>
                        <p className="text-autumn-muted text-sm">
                          Chrome на Windows • Москва, Россия • IP: 192.168.1.1
                        </p>
                        <p className="text-autumn-muted text-xs mt-1">Активно сейчас</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Текущая</Badge>
                    </div>
                  </div>
                  <div className="p-4 rounded-md bg-firmament">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-autumn font-medium">Safari на MacOS</p>
                        <p className="text-autumn-muted text-sm">Санкт-Петербург, Россия • IP: 192.168.2.2</p>
                        <p className="text-autumn-muted text-xs mt-1">Последняя активность: 2 дня назад</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                        Завершить
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 rounded-md bg-firmament">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-autumn font-medium">Firefox на Ubuntu</p>
                        <p className="text-autumn-muted text-sm">Казань, Россия • IP: 192.168.3.3</p>
                        <p className="text-autumn-muted text-xs mt-1">Последняя активность: 5 дней назад</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                        Завершить
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="destructive" className="bg-demonic hover:bg-demonic/90">
                    Завершить все сессии
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Настройки уведомлений</CardTitle>
                <CardDescription className="text-autumn-muted">Управление уведомлениями и оповещениями</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-autumn font-medium">Email-уведомления</p>
                      <p className="text-autumn-muted text-sm">Получать уведомления по электронной почте</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-firmament-lighter" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-autumn font-medium">Push-уведомления</p>
                      <p className="text-autumn-muted text-sm">Получать push-уведомления в браузере</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-firmament-lighter" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-autumn font-medium">Telegram-уведомления</p>
                      <p className="text-autumn-muted text-sm">Получать уведомления в Telegram</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Типы уведомлений</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Выберите, о каких событиях вы хотите получать уведомления
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-autumn font-medium">Результаты анализа</p>
                      <p className="text-autumn-muted text-sm">
                        Уведомления о завершении анализа смарт-контрактов и обнаруженных уязвимостях
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-firmament-lighter" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-autumn font-medium">Новые уязвимости</p>
                      <p className="text-autumn-muted text-sm">
                        Уведомления о новых обнаруженных уязвимостях в базе знаний
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-firmament-lighter" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-autumn font-medium">Обновления безопасности</p>
                      <p className="text-autumn-muted text-sm">
                        Важные обновления и рекомендации по безопасности смарт-контрактов
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-firmament-lighter" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-autumn font-medium">Комментарии и ответы</p>
                      <p className="text-autumn-muted text-sm">
                        Уведомления о комментариях и ответах на ваши материалы и обсуждения
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-firmament-lighter" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-autumn font-medium">Маркетинговые рассылки</p>
                      <p className="text-autumn-muted text-sm">
                        Новости, обновления продукта и специальные предложения
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Тема оформления</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Настройте внешний вид приложения по вашему вкусу
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-md bg-firmament border-2 border-atomic flex flex-col items-center">
                    <div className="size-24 rounded-md bg-firmament-light mb-4 flex items-center justify-center">
                      <Moon className="size-8 text-autumn" />
                    </div>
                    <p className="text-autumn font-medium">Темная (по умолчанию)</p>
                  </div>
                  <div className="p-4 rounded-md bg-white border border-firmament-lighter flex flex-col items-center">
                    <div className="size-24 rounded-md bg-gray-100 mb-4 flex items-center justify-center">
                      <Moon className="size-8 text-gray-800" />
                    </div>
                    <p className="text-gray-800 font-medium">Светлая</p>
                  </div>
                  <div className="p-4 rounded-md bg-firmament border border-firmament-lighter flex flex-col items-center">
                    <div className="size-24 rounded-md bg-firmament-light mb-4 flex items-center justify-center">
                      <Globe className="size-8 text-autumn" />
                    </div>
                    <p className="text-autumn font-medium">Системная</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Язык интерфейса</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Выберите предпочтительный язык интерфейса
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select defaultValue="ru">
                  <SelectTrigger className="w-full md:w-[300px] bg-firmament border-firmament-lighter text-autumn">
                    <SelectValue placeholder="Выберите язык" />
                  </SelectTrigger>
                  <SelectContent className="bg-firmament-light border-firmament-lighter text-autumn">
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Настройки отображения</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Настройте параметры отображения интерфейса
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-autumn font-medium">Компактный режим</p>
                      <p className="text-autumn-muted text-sm">
                        Уменьшить отступы и размеры элементов для отображения большего количества информации
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Separator className="bg-firmament-lighter" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-autumn font-medium">Анимации</p>
                      <p className="text-autumn-muted text-sm">Включить анимации интерфейса</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-firmament-lighter" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-autumn font-medium">Размер шрифта кода</p>
                      <p className="text-autumn-muted text-sm">Настройте размер шрифта для отображения кода</p>
                    </div>
                    <Select defaultValue="medium">
                      <SelectTrigger className="w-[150px] bg-firmament border-firmament-lighter text-autumn">
                        <SelectValue placeholder="Выберите размер" />
                      </SelectTrigger>
                      <SelectContent className="bg-firmament-light border-firmament-lighter text-autumn">
                        <SelectItem value="small">Маленький</SelectItem>
                        <SelectItem value="medium">Средний</SelectItem>
                        <SelectItem value="large">Большой</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Подключенные кошельки</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Управление подключенными криптовалютными кошельками
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-md bg-firmament">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-atomic/20 flex items-center justify-center">
                          <img src="/placeholder.svg?height=40&width=40" alt="MetaMask" className="size-6" />
                        </div>
                        <div>
                          <p className="text-autumn font-medium">MetaMask</p>
                          <p className="text-autumn-muted text-sm">0x7a25...2488D</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Основной</Badge>
                    </div>
                  </div>
                  <div className="p-4 rounded-md bg-firmament">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-atomic/20 flex items-center justify-center">
                          <img src="/placeholder.svg?height=40&width=40" alt="WalletConnect" className="size-6" />
                        </div>
                        <div>
                          <p className="text-autumn font-medium">WalletConnect</p>
                          <p className="text-autumn-muted text-sm">0x1f98...1F984</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                        Отключить
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="bg-atomic hover:bg-atomic/90">
                    <Plus className="mr-2 size-4" />
                    Подключить кошелек
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Сети блокчейн</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Настройте предпочтительные сети для анализа смарт-контрактов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-atomic/20 flex items-center justify-center">
                        <img src="/placeholder.svg?height=32&width=32" alt="Ethereum" className="size-5" />
                      </div>
                      <p className="text-autumn font-medium">Ethereum Mainnet</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-firmament-lighter" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-atomic/20 flex items-center justify-center">
                        <img src="/placeholder.svg?height=32&width=32" alt="BSC" className="size-5" />
                      </div>
                      <p className="text-autumn font-medium">Binance Smart Chain</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-firmament-lighter" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-atomic/20 flex items-center justify-center">
                        <img src="/placeholder.svg?height=32&width=32" alt="Polygon" className="size-5" />
                      </div>
                      <p className="text-autumn font-medium">Polygon</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-firmament-lighter" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-atomic/20 flex items-center justify-center">
                        <img src="/placeholder.svg?height=32&width=32" alt="Arbitrum" className="size-5" />
                      </div>
                      <p className="text-autumn font-medium">Arbitrum</p>
                    </div>
                    <Switch />
                  </div>
                  <Separator className="bg-firmament-lighter" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-atomic/20 flex items-center justify-center">
                        <img src="/placeholder.svg?height=32&width=32" alt="Optimism" className="size-5" />
                      </div>
                      <p className="text-autumn font-medium">Optimism</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">API-ключи</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Управление API-ключами для доступа к сервису
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-md bg-firmament">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-autumn font-medium">Основной ключ</p>
                        <p className="text-autumn-muted text-sm">Создан: 15 апр 2023</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            value="sk_live_51KjH2nGhTr7Y6JxZQWERtyuI..."
                            readOnly
                            className="bg-firmament-lighter border-firmament-lighter text-autumn"
                          />
                          <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                            Копировать
                          </Button>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                        Обновить
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 rounded-md bg-firmament">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-autumn font-medium">Тестовый ключ</p>
                        <p className="text-autumn-muted text-sm">Создан: 15 апр 2023</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            value="sk_test_51KjH2nGhTr7Y6JxZQWERtyuI..."
                            readOnly
                            className="bg-firmament-lighter border-firmament-lighter text-autumn"
                          />
                          <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                            Копировать
                          </Button>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-firmament-lighter text-autumn">
                        Обновить
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="bg-atomic hover:bg-atomic/90">
                    <Plus className="mr-2 size-4" />
                    Создать новый ключ
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Webhook-интеграции</CardTitle>
                <CardDescription className="text-autumn-muted">
                  Настройте webhook-уведомления для интеграции с вашими системами
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-md bg-firmament">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-autumn font-medium">Результаты анализа</p>
                        <p className="text-autumn-muted text-sm">
                          Отправка результатов анализа смарт-контрактов на указанный URL
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            value="https://example.com/webhooks/analysis"
                            className="bg-firmament-lighter border-firmament-lighter text-autumn"
                          />
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="p-4 rounded-md bg-firmament">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-autumn font-medium">Обнаружение уязвимостей</p>
                        <p className="text-autumn-muted text-sm">
                          Отправка уведомлений при обнаружении критических уязвимостей
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            value="https://example.com/webhooks/vulnerabilities"
                            className="bg-firmament-lighter border-firmament-lighter text-autumn"
                          />
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="bg-atomic hover:bg-atomic/90">
                    <Plus className="mr-2 size-4" />
                    Добавить webhook
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-firmament-light border-firmament-lighter">
              <CardHeader>
                <CardTitle className="text-autumn">Документация API</CardTitle>
                <CardDescription className="text-autumn-muted">Ресурсы для интеграции с API DeepGuard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-md bg-firmament">
                    <div className="flex items-center gap-3">
                      <FileText className="size-8 text-atomic" />
                      <div>
                        <p className="text-autumn font-medium">Документация API</p>
                        <p className="text-autumn-muted text-sm">Полная документация по использованию API DeepGuard</p>
                      </div>
                      <Button variant="outline" className="ml-auto border-firmament-lighter text-autumn">
                        Открыть
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 rounded-md bg-firmament">
                    <div className="flex items-center gap-3">
                      <Code className="size-8 text-atomic" />
                      <div>
                        <p className="text-autumn font-medium">Примеры кода</p>
                        <p className="text-autumn-muted text-sm">
                          Примеры интеграции API на различных языках программирования
                        </p>
                      </div>
                      <Button variant="outline" className="ml-auto border-firmament-lighter text-autumn">
                        Открыть
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 rounded-md bg-firmament">
                    <div className="flex items-center gap-3">
                      <Lock className="size-8 text-atomic" />
                      <div>
                        <p className="text-autumn font-medium">Руководство по безопасности</p>
                        <p className="text-autumn-muted text-sm">
                          Рекомендации по безопасному использованию API DeepGuard
                        </p>
                      </div>
                      <Button variant="outline" className="ml-auto border-firmament-lighter text-autumn">
                        Открыть
                      </Button>
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
