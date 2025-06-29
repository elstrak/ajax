## Информация

**Тема диплома**: Разработка программной системы для выявления уязвимостей в смарт-контрактах

**Автор**: Гандзюк Данил Александрович

**Группа**: Б9121-09.03.04

**Научный руководитель**: Старший преподаватель ДПИиИИ Крестникова Ольга Александровна

## Основной репозиторий

<div align="left" width="50%">
    <a href="https://github.com/elstrak/ajax" target="_blank">
        <img src="https://github-readme-stats.vercel.app/api/pin/?username=elstrak&repo=ajax&border_radius=10&theme=dark">
    </a>
</div>

## Требования

- NodeJS v22.14.0
- Python v3.13.1
- pip v25.1.1

## Пошаговая инструкция
### 1. Клонирование репозитория
**Установите Git LFS:**
   ```bash
   # Windows (с Git for Windows)
   git lfs install
   
   # macOS
   brew install git-lfs
   git lfs install
   ```
Клонируйте репозиторий любым удобным для Вас способом.
```bash
git clone https://github.com/elstrak/ajax.git
```
```bash
cd ajax
git lfs pull  # Нужно для загрузки файла модели ML
```

---

### 2. Установка MongoDB
1. **Windows:**
   1. Скачайте MongoDB Community Server с mongodb.com
   2. Установите, следуя инструкциям
   3. Запустите MongoDB:
    ```cmd
    net start MongoDB
    ```

2. **macOS:**
    ```bash
    brew install mongodb-community
    brew services start mongodb-community
    ```

---

### 3. Настройка сервера

1. **Откройте терминал в папке server:**
    ```bash
    cd server
    ```

2. **Установите зависимости:**
    ```bash
    npm install
    ```

3. **Создайте файл .env в папке server со следующим содержимым:**
    ```text
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/smartcontract-analyzer
   JWT_SECRET=some_secret_key
   NODE_ENV=development
   ML_SERVICE_URL=http://localhost:8000
    ```

---

### 4. Настройка ML-сервиса

1. **Откройте терминал в папке ml_service:**
    ```bash
    cd ml_service
    ```

2. **Установите зависимости:**
    ```bash
    pip install -r requirements.txt
    ```
  Примечание: Если у вас нет CUDA или возникают проблемы с PyTorch, используйте CPU версию:
   ```bash
    pip install torch==2.7.0 torchvision==0.22.0 torchaudio==2.7.0 --index-url https://download.pytorch.org/whl/cpu
   ```
---

### 5. Настройка клиента

1. **Откройте терминал в папке ml_service:**
    ```bash
    cd client
    ```

2. **Установите зависимости:**
    ```bash
    npm install
    ```

## Запуск
Запускайте все три сервиса в разных терминалах одновременно!
### 1. Терминал 1: ML сервис
```bash
cd ml_service/src/api
```
```bash
python -m uvicorn fastapi_service:app --reload --host 0.0.0.0 --port 8000
```

---

### 2. Терминал 2: Сервер
```bash
cd server
```
```bash
npm run dev
```

---

### 3. Терминал 3: Клиент
```bash
cd client
```
```bash
npm run dev
```

---

Приложение будет доступно по адресу:  
[http://localhost:3000/](http://localhost:3000/)

---
