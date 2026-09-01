<div align="center">
  <img src="frontend/public/invoiceflow_logo.jpg" alt="InvoiceFlow Logo" width="100" style="border-radius: 24px; box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);" />
  
  # InvoiceFlow ⚡

  ### Smart Invoicing & Business Finance Management Platform

  *The modern financial hub built for SaaS founders, agency owners, and independent professionals.*

  [![Live App](https://img.shields.io/badge/Live%20App-invoiceflow.rajpakhurde.in-blue?style=for-the-badge&logo=vercel)](https://invoiceflow.rajpakhurde.in)
  [![Backend API](https://img.shields.io/badge/API-api.rajpakhurde.in-emerald?style=for-the-badge&logo=render)](https://api.invoiceflow.rajpakhurde.in/api/health)
  [![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

  <br />

  [🌐 **Explore Live App**](https://invoiceflow.rajpakhurde.in) • [🔑 **Quick Demo Login**](#-quick-demo-access) • [📖 **API Documentation**](#-api-endpoints) • [🚀 **Getting Started**](#-getting-started)

</div>

---

## 🌟 Overview

**InvoiceFlow** is a full-stack, enterprise-grade invoicing and business expenditure management web application. Designed with modern aesthetics and high-performance server-side data architecture, InvoiceFlow empowers users to streamline client billing, track cash flow trends, manage business expenses, and generate pixel-perfect PDF receipts effortlessly.

---

## ✨ Key Features

- 📊 **Executive Dashboard**: Real-time revenue analytics, net profit margins, expense breakdowns, and interactive invoice status distribution charts powered by Recharts.
- 📄 **Instant PDF Receipts**: Generate, preview, and download custom PDF invoices with customizable tax rates, line items breakdown, and terms.
- ⚡ **High-Performance Pagination**: Server-side Prisma database pagination with rows-per-page selectors and instant search filtering.
- 💼 **Expense Tracker**: Track business expenditures, categorize operational costs, and monitor net profit margins.
- 👥 **Client Directory**: Store client contact profiles, corporate billing addresses, and Tax/GSTIN identifiers for seamless billing.
- 🛡️ **Enterprise Security & Audit Logs**: Secure HTTP-Only JWT authentication with automatic database audit logging tracking user `LOGIN` and `LOGOUT` sessions (IP address, User-Agent, and timestamps).
- 🎨 **Modern Glassmorphism UI**: Built with TailwindCSS and Framer Motion for scroll reveals, continuous 3D hero floating physics, and direction-aware showcase tab animations.

---

## 🔑 Quick Demo Access

Want to test InvoiceFlow immediately without creating an account? Use our pre-seeded portfolio demo account or use the **1-Click Auto Login** button on the sign-in page:

| Field | Demo Credentials |
| :--- | :--- |
| **Live App URL** | [https://invoiceflow.rajpakhurde.in/login](https://invoiceflow.rajpakhurde.in/login) |
| **Email** | `demo@invoiceflow.app` |
| **Password** | `password123` |

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18 (Vite)
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS, Lucide Icons, Glassmorphism UI
- **Animations**: Framer Motion (60fps 3D Physics & Directional Slide)
- **Forms & Validation**: React Hook Form + Zod
- **Data Visualization**: Recharts
- **PDF Generation**: jsPDF + autoTable

### **Backend**
- **Runtime & Framework**: Node.js, Express.js
- **Database & ORM**: Supabase PostgreSQL + Prisma ORM v7 (`@prisma/adapter-pg`)
- **Authentication**: JWT (JSON Web Tokens), Bcrypt, HTTP-Only SameSite=None Secure Cookies
- **Hosting & Infrastructure**: Render (Backend API), Vercel (Frontend SPA), Cloudflare DNS

---

## 📂 Project Structure

```
invoiceflow/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema definitions & AuditLog model
│   │   └── seed.js              # Database seeder script
│   ├── src/
│   │   ├── config/              # DB & Environment variables configuration
│   │   ├── middleware/          # JWT auth & error handling middleware
│   │   ├── modules/
│   │   │   ├── auditLogs/       # Audit logging module (LOGIN/LOGOUT)
│   │   │   ├── auth/            # Authentication & session controllers
│   │   │   ├── clients/         # Client directory endpoints
│   │   │   ├── dashboard/       # Executive analytics endpoints
│   │   │   ├── expenses/        # Expense tracking endpoints
│   │   │   └── invoices/        # Invoices CRUD & PDF endpoints
│   │   └── app.js               # Express application setup
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                 # Axios client API instances
│   │   ├── app/                 # Redux store configuration
│   │   ├── components/          # Shared UI components & layout Navbar
│   │   ├── features/
│   │   │   ├── auth/            # Login, Register & Auth Redux slice
│   │   │   ├── clients/         # Client management views
│   │   │   ├── dashboard/       # Executive analytics dashboard
│   │   │   ├── expenses/        # Expense list & form views
│   │   │   ├── invoices/        # Invoice creation, detail & PDF view
│   │   │   └── landing/         # Animated landing page
│   │   └── routes/              # App routing & protected route guards
│   └── package.json
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js `v18.x` or higher
- PostgreSQL Database (e.g. Supabase, PostgreSQL instance)

### **1. Clone the Repository**
```bash
git clone https://github.com/RajPakhurde/InvoiceFlow.git
cd InvoiceFlow
```

### **2. Setup Backend**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

Configure your `backend/.env` file:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
JWT_ACCESS_SECRET="your_access_secret_key"
JWT_REFRESH_SECRET="your_refresh_secret_key"
FRONTEND_URL="http://localhost:5173"
```

Push database schema and seed initial data:
```bash
npx prisma db push
node prisma/seed.js

# Start backend server
npm run dev
```

### **3. Setup Frontend**
```bash
cd ../frontend
npm install

# Create .env file
cp .env.example .env
```

Configure your `frontend/.env` file:
```env
VITE_API_BASE_URL="http://localhost:5000/api"
```

Start Vite development server:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new user account | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & issue tokens | ❌ |
| `POST` | `/api/auth/logout` | Clear refresh token & record audit log | ❌ |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | ✅ |
| `GET` | `/api/dashboard/stats` | Fetch executive dashboard metrics | ✅ |
| `GET` | `/api/invoices` | List invoices with server pagination | ✅ |
| `POST` | `/api/invoices` | Create new invoice with line items | ✅ |
| `GET` | `/api/invoices/:id` | Fetch detailed invoice receipt data | ✅ |
| `GET` | `/api/expenses` | List expenditures & categories | ✅ |
| `GET` | `/api/clients` | List client directory profiles | ✅ |
| `GET` | `/api/audit-logs` | Fetch user login & logout activity logs | ✅ |

---

## 🔒 Security & Best Practices

- **Password Hashing**: Salted bcrypt hashing (10 rounds).
- **Session Protection**: Dual JWT token architecture (Short-lived 15m access token + 7d HTTP-Only SameSite=None refresh cookie).
- **Database Safety**: Special character URL encoding for URI connection strings and Prisma v7 PG driver adapter (`@prisma/adapter-pg`).
- **Audit Logging**: Internal database table (`audit_logs`) tracking `LOGIN` and `LOGOUT` events along with client IP addresses and User-Agent details.

---

## 👤 Author

**Raj Pakhurde**
- Portfolio: [rajpakhurde.in](https://rajpakhurde.in)
- GitHub: [@RajPakhurde](https://github.com/RajPakhurde)
- InvoiceFlow Application: [invoiceflow.rajpakhurde.in](https://invoiceflow.rajpakhurde.in)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
