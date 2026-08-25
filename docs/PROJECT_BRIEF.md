# Project Brief: InvoiceFlow

## 1. Overview
InvoiceFlow is a multi-tenant SaaS web application that helps freelancers and small
agencies manage clients, create and send professional invoices, track payments,
log business expenses, and view income/expense analytics on a dashboard.

This project is being built as a portfolio demo to showcase full-stack development
skills (auth, relational data modeling, PDF generation, payment integration, and
data visualization) for freelance client acquisition. It is also intended to be
used as a real invoicing tool by the developer.

## 2. Problem Statement
Freelancers and small agencies often rely on scattered tools (Excel, Word templates,
WhatsApp) to manage clients, generate invoices, and track payments. This leads to:
- Inconsistent, unprofessional invoices
- No centralized view of outstanding payments
- No easy way to track expenses against income
- Manual, error-prone follow-ups for unpaid invoices

InvoiceFlow solves this with a single dashboard to manage clients, invoices,
payments, and expenses — with automated PDF generation and payment tracking.

## 3. Target Users
- Freelance developers, designers, and consultants
- Small agencies/studios (2–10 people) needing simple invoicing
- Solo service providers (photographers, tutors, consultants)

## 4. Goals
- Demonstrate production-quality full-stack architecture (auth, APIs, DB design)
- Provide genuine daily-use value (developer will use it for their own invoicing)
- Showcase integration skills: PDF generation, email delivery, payment webhooks
- Keep MVP scope tight enough to complete in 2–3 weeks

## 5. Core Features (MVP — Phase 1)
- [x] User authentication (JWT-based signup/login)
- [x] Multi-tenant data isolation (each user only sees their own data)
- [x] Client management (CRUD)
- [x] Invoice creation with line items, auto-calculated totals
- [x] Invoice PDF generation and download
- [x] Invoice email delivery to client
- [x] Invoice status tracking (Draft → Sent → Paid → Overdue)
- [x] Manual "mark as paid" action
- [x] Expense logging (CRUD) with category and date
- [x] Dashboard with revenue vs. expense chart (monthly)
- [x] Dashboard summary cards (total outstanding, total paid, net profit)

## 6. Phase 2 Features (Out of Scope for MVP)
- Razorpay/Stripe "Pay Now" link with webhook-based auto status update
- Recurring/auto-generated invoices for retainer clients
- Multi-currency support
- Receipt upload for expenses
- CSV export for accountants
- Custom PDF invoice templates/themes
- Google OAuth login

## 7. Explicitly Out of Scope (v1)
- Team/multi-user accounts under one organization (single-user tenancy only)
- Mobile app (web-responsive only)
- Multi-language support
- Tax filing or accounting-software integrations

## 8. Success Criteria
- A user can sign up, add a client, create an invoice, download it as a PDF,
  email it, and mark it as paid — end to end, without errors.
- Dashboard accurately reflects revenue and expense totals based on real data.
- App is deployed and publicly accessible with a working demo account.
- Codebase is clean enough to walk a client/interviewer through confidently.

## 9. Non-Functional Requirements
- Responsive UI (desktop + tablet, mobile-friendly minimum)
- Passwords hashed (bcrypt), JWT secrets stored via environment variables
- API input validation on all write endpoints
- Basic error handling and user-facing error messages (no raw stack traces)

## 10. Deliverables
- Deployed live demo (frontend + backend + DB)
- GitHub repo with docs (`/docs` folder: this brief, tech stack, API spec, schema)
- README with setup instructions and demo login credentials
- 1-paragraph case study for portfolio site describing the problem solved
