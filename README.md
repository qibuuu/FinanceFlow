# FinanceFlow — Personal Finance Management

A full-stack personal finance management web application built with React + Vite + TailwindCSS on the frontend and Node.js + Express + MongoDB on the backend.

## Features

- 🔐 **Authentication** — Register, login, logout with JWT tokens
- 💸 **Transactions** — Add, edit, delete income and expense transactions
- 🏷️ **Categories** — 13 predefined categories (Food, Travel, Salary, etc.)
- 📊 **Dashboard** — Total balance, monthly charts (bar + pie), category breakdown
- 🔍 **Filter & Search** — Filter by type, category, date range; search by description
- 📄 **Pagination** — Paginated transaction list
- 🎯 **Budget Planning** — Set monthly budgets per category
- 🚨 **Budget Alerts** — Visual warnings when approaching (80%) or exceeding budget
- 📥 **CSV Export** — Download filtered transactions as CSV
- 🌙 **Dark Mode** — Toggle between dark and light themes (persisted)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, TailwindCSS v4 |
| Charts | Recharts |
| Icons | Lucide React |
| HTTP Client | Axios |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken, bcryptjs) |
| Notifications | React Hot Toast |

## Project Structure

```
testAgent/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Transaction.js
│   │   │   └── Budget.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── transactionController.js
│   │   │   └── budgetController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── transactions.js
│   │   │   └── budgets.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   └── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axios.js
    │   │   └── index.js
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── SummaryCards.jsx
    │   │   ├── Charts.jsx
    │   │   ├── TransactionForm.jsx
    │   │   ├── TransactionTable.jsx
    │   │   ├── BudgetForm.jsx
    │   │   └── Pagination.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── TransactionsPage.jsx
    │   │   └── BudgetPage.jsx
    │   ├── utils/
    │   │   └── constants.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── package.json
```

## Prerequisites

- Node.js >= 18
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

## Setup & Run

### 1. Start MongoDB

**Local MongoDB:**
```
mongod
```
Or use [MongoDB Atlas](https://www.mongodb.com/atlas) and update `MONGO_URI` in `backend/.env`.

### 2. Configure environment variables

**`backend/.env`** (already created):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/financeapp
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**`frontend/.env`** (already created):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start the Backend

```bash
cd backend
npm run dev     # development (nodemon auto-restart)
# or
npm start       # production
```

Backend runs at: **http://localhost:5000**

### 4. Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at: **http://localhost:5173**

## API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |

### Transactions
| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/transactions` | Filter: type, category, search, startDate, endDate, page, limit |
| POST | `/api/transactions` | Create transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| GET | `/api/transactions/summary` | Dashboard data (aggregated) |
| GET | `/api/transactions/export` | Download CSV |

### Budgets
| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/budgets` | Filter by month/year |
| POST | `/api/budgets` | Create or update budget |
| DELETE | `/api/budgets/:id` | Delete budget |

## Environment Notes

- Change `JWT_SECRET` to a strong random string in production
- Configure `CORS` origin in `backend/src/server.js` for production domains
- Use MongoDB Atlas connection string for cloud deployment
