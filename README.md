```markdown
# Web Application: Balance Management API

Микросервис для управления балансом пользователей с REST API

## 📋 Предварительные требования

- Node.js v18+
- npm v9+
- PostgreSQL v15+
- Git

## 🛠 Установка

```bash
# Клонировать репозиторий
git clone https://github.com/anna-fridrih/test_.git
cd test_

# Установить зависимости
npm install

# Создать файл окружения
cp .env.example .env
```

## ⚙️ Настройка базы данных

1. Создайте базу данных в PostgreSQL:
```sql
CREATE DATABASE balance_service;
CREATE USER balance_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE balance_service TO balance_user;
```

2. Настройте подключение в `.env`:
```ini
DB_USER=balance_user
DB_PASS=secure_password
DB_NAME=balance_service
DB_HOST=localhost
DB_PORT=5432
```

3. Запустите миграции:
```bash
npm run migrate
```

## 🚀 Запуск сервера

```bash
node server.js
```

Сервер будет доступен на: `http://localhost:3000`

## 📡 Пример использования API

Обновление баланса:
```bash
curl -X POST http://localhost:3000/balance/update \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "amount": -100}'
```

Ответ:
```json
{
  "success": true,
  "balance": 9900
}
```

## 🧰 Используемые технологии
- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- Joi (валидация)
- Winston (логирование)

