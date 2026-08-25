# Folder Structure: InvoiceFlow

Monorepo with two top-level apps: `frontend` and `backend`, plus shared docs.

invoiceflow/
├── docs/
│ ├── PROJECT_BRIEF.md
│ ├── TECH_STACK.md
│ ├── API_SPEC.md
│ ├── schema.prisma
│ ├── FOLDER_STRUCTURE.md
│ └── TASKS.md
│
├── backend/
│ ├── prisma/
│ │ ├── schema.prisma
│ │ └── migrations/
│ ├── src/
│ │ ├── config/ # env config, db client init
│ │ │ └── env.js
│ │ ├── middleware/
│ │ │ ├── auth.js # JWT verify middleware
│ │ │ ├── errorHandler.js
│ │ │ └── validate.js
│ │ ├── modules/
│ │ │ ├── auth/
│ │ │ │ ├── auth.controller.js
│ │ │ │ ├── auth.service.js
│ │ │ │ └── auth.routes.js
│ │ │ ├── clients/
│ │ │ │ ├── clients.controller.js
│ │ │ │ ├── clients.service.js
│ │ │ │ └── clients.routes.js
│ │ │ ├── invoices/
│ │ │ │ ├── invoices.controller.js
│ │ │ │ ├── invoices.service.js
│ │ │ │ ├── invoices.routes.js
│ │ │ │ └── invoice.pdf.js # Puppeteer PDF generation
│ │ │ ├── expenses/
│ │ │ │ ├── expenses.controller.js
│ │ │ │ ├── expenses.service.js
│ │ │ │ └── expenses.routes.js
│ │ │ ├── dashboard/
│ │ │ │ ├── dashboard.controller.js
│ │ │ │ ├── dashboard.service.js
│ │ │ │ └── dashboard.routes.js
│ │ │ └── payments/ # Phase 2
│ │ │ ├── payments.controller.js
│ │ │ ├── payments.service.js
│ │ │ └── payments.routes.js
│ │ ├── templates/
│ │ │ └── invoice.html # HTML template for PDF rendering
│ │ ├── utils/
│ │ │ ├── mailer.js
│ │ │ ├── jwt.js
│ │ │ └── invoiceNumber.js
│ │ ├── app.js # Express app setup
│ │ └── server.js # Entry point
│ ├── .env.example
│ ├── package.json
│ └── README.md
│
├── frontend/
│ ├── src/
│ │ ├── api/ # Axios instance + API call functions
│ │ │ ├── axiosClient.js
│ │ │ ├── authApi.js
│ │ │ ├── clientsApi.js
│ │ │ ├── invoicesApi.js
│ │ │ ├── expensesApi.js
│ │ │ └── dashboardApi.js
│ │ ├── app/
│ │ │ └── store.js # Redux store
│ │ ├── features/
│ │ │ ├── auth/
│ │ │ │ ├── authSlice.js
│ │ │ │ ├── LoginPage.jsx
│ │ │ │ └── RegisterPage.jsx
│ │ │ ├── clients/
│ │ │ │ ├── clientsSlice.js
│ │ │ │ ├── ClientsListPage.jsx
│ │ │ │ └── ClientFormModal.jsx
│ │ │ ├── invoices/
│ │ │ │ ├── invoicesSlice.js
│ │ │ │ ├── InvoicesListPage.jsx
│ │ │ │ ├── InvoiceFormPage.jsx
│ │ │ │ └── InvoiceDetailPage.jsx
│ │ │ ├── expenses/
│ │ │ │ ├── expensesSlice.js
│ │ │ │ ├── ExpensesListPage.jsx
│ │ │ │ └── ExpenseFormModal.jsx
│ │ │ └── dashboard/
│ │ │ ├── dashboardSlice.js
│ │ │ └── DashboardPage.jsx
│ │ ├── components/ # shared/reusable UI components
│ │ │ ├── Navbar.jsx
│ │ │ ├── Sidebar.jsx
│ │ │ ├── Button.jsx
│ │ │ ├── Table.jsx
│ │ │ └── ProtectedRoute.jsx
│ │ ├── layouts/
│ │ │ └── DashboardLayout.jsx
│ │ ├── routes/
│ │ │ └── AppRoutes.jsx
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── .env.example
│ ├── package.json
│ └── README.md
│
├── .gitignore
└── README.md


## Notes
- **Module-based backend structure** (`modules/auth`, `modules/invoices`, etc.) instead of grouping by layer (`controllers/`, `services/`) — keeps related code together, easier for an agent to navigate one feature at a time.
- **Feature-based frontend structure** mirrors the backend modules — same mental model on both sides.
- Each `module` folder follows the same 3-file pattern: `*.routes.js` → `*.controller.js` → `*.service.js` (routes define endpoints, controllers handle req/res, services contain business logic + Prisma calls). Keep this pattern consistent everywhere.
