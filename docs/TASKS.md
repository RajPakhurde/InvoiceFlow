# Build Tasks: InvoiceFlow

Ordered task list for MVP build. Check off as completed. Feed to coding agent
incrementally — one section at a time, not the whole file at once.

## Phase 0: Project Setup
- [x] Initialize monorepo structure per FOLDER_STRUCTURE.md
- [x] Set up backend: Express app skeleton, dotenv config, basic health-check route
- [x] Set up Prisma: install, init, paste schema.prisma, run first migration
- [x] Set up frontend: Vite + React project, Tailwind config, React Router setup
- [x] Set up Redux Toolkit store with empty slices
- [x] Create .env.example files (backend + frontend)
- [x] Verify backend and frontend run locally and connect (basic ping test)

## Phase 1: Authentication
- [x] Backend: User model already in schema — implement register endpoint (hash password with bcrypt)
- [x] Backend: Login endpoint, issue access + refresh tokens
- [x] Backend: JWT auth middleware to protect routes
- [x] Backend: Refresh token endpoint, logout endpoint
- [x] Frontend: Register page + form validation
- [x] Frontend: Login page + form validation
- [x] Frontend: Store access token in Redux, refresh token handling
- [x] Frontend: ProtectedRoute component, redirect unauthenticated users
- [x] Test: full register → login → access protected route flow

## Phase 2: Client Management
- [x] Backend: Client CRUD endpoints (GET list, GET one, POST, PUT, DELETE)
- [x] Backend: Validation (name/email required)
- [x] Backend: Prevent delete if client has invoices (409 response)
- [x] Frontend: Clients list page with search
- [x] Frontend: Add/Edit client modal form
- [x] Frontend: Delete client with confirmation
- [x] Test: full client CRUD flow via UI

## Phase 3: Invoice Creation
- [x] Backend: Invoice CRUD endpoints (draft-only edit/delete rule)
- [x] Backend: Auto-generate invoiceNumber per user (INV-0001, INV-0002...)
- [x] Backend: Auto-calculate subtotal, tax, total from line items
- [x] Backend: Status update endpoint (PATCH /status)
- [x] Frontend: Invoice list page with status filter
- [x] Frontend: Invoice creation form (dynamic line items add/remove)
- [x] Frontend: Invoice detail/view page
- [x] Test: create invoice with multiple line items, verify totals calculate correctly

## Phase 4: PDF Generation & Email
- [x] Backend: Build HTML invoice template (templates/invoice.html)
- [x] Backend: Puppeteer setup to render HTML → PDF
- [x] Backend: GET /invoices/:id/pdf — stream PDF as file response
- [x] Backend: Nodemailer setup, SMTP config
- [x] Backend: POST /invoices/:id/send — generate PDF, email to client, update status to "sent"
- [x] Frontend: "Download PDF" button on invoice detail page
- [x] Frontend: "Send Invoice" button with loading/success state
- [x] Test: download PDF looks correct, email arrives with attachment

## Phase 5: Expense Tracking
- [x] Backend: Expense CRUD endpoints
- [x] Backend: Filter by category/date range
- [x] Frontend: Expenses list page with filters
- [x] Frontend: Add/Edit expense modal
- [x] Test: full expense CRUD flow

## Phase 6: Dashboard
- [x] Backend: GET /dashboard/summary (totals aggregation)
- [x] Backend: GET /dashboard/revenue-chart (monthly grouped data)
- [x] Frontend: Dashboard page layout
- [x] Frontend: Summary cards (outstanding, paid, expenses, net profit)
- [x] Frontend: Revenue vs expense chart (Recharts)
- [x] Test: dashboard numbers match manually calculated totals

## Phase 7: Polish & Deploy
- [x] Error handling middleware (consistent error response format)
- [x] Loading states / empty states across all pages
- [x] Responsive design pass (mobile/tablet check)
- [x] Seed demo data script (for portfolio demo account)
- [ ] Deploy backend to Render
- [ ] Deploy database (Render MySQL or Railway)
- [ ] Deploy frontend to Vercel
- [ ] Update README with live demo link + demo credentials
- [ ] Final QA pass: full user flow end-to-end on production

## Phase 8 (Optional — Phase 2 Features, post-MVP)
- [ ] Razorpay integration: payment link generation
- [ ] Razorpay webhook handler for auto payment status update
- [ ] Recurring invoices (cron job)
- [ ] CSV export for invoices/expenses
