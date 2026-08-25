# Tech Stack: InvoiceFlow

## 1. Frontend
- **Framework:** React.js (Vite)
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form + Zod (validation)
- **Routing:** React Router v6
- **Deployment:** Vercel

## 2. Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** JavaScript (or TypeScript — recommended for a portfolio project,
  shows stronger engineering practices)
- **Auth:** JWT (access token + refresh token), bcrypt for password hashing
- **Validation:** Zod / express-validator
- **Deployment:** Render (Web Service)

## 3. Database
- **DB:** MySQL
- **ORM:** Prisma (recommended — type-safe queries, easy migrations) or Sequelize
- **Hosting:** Render (Managed MySQL) or Railway MySQL (fallback if Render's
  free-tier DB has constraints — confirm during setup)

## 4. PDF Generation
- **Library:** Puppeteer (renders HTML/CSS invoice template to PDF — easiest to
  style nicely) or `pdf-lib` (lighter weight, more manual layout control)
- **Recommendation:** Puppeteer for MVP — faster to get a polished-looking invoice

## 5. Email Delivery
- **Library:** Nodemailer
- **SMTP Provider:** Gmail SMTP (dev/demo) → migrate to SendGrid/Resend for
  production reliability if needed later

## 6. Payments (Phase 2)
- **Gateway:** Razorpay
- **Flow:** Razorpay Orders API for "Pay Now" link on invoice → webhook listener
  on backend to auto-update invoice status to "Paid"

## 7. Authentication Details
- **Access token:** short-lived (15 min), sent in Authorization header
- **Refresh token:** long-lived (7 days), stored in httpOnly cookie
- **Password hashing:** bcrypt (salt rounds: 10)

## 8. Dev Tools
- **API testing:** Postman
- **Version control:** Git + GitHub
- **Env management:** dotenv (`.env` local, `.env.example` committed)
- **Linting/Formatting:** ESLint + Prettier

## 9. Deployment Summary
| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend (Express API) | Render |
| Database (MySQL) | Render Managed MySQL (or Railway if needed) |
| File/PDF storage | Local temp generation → stream to client (no persistent storage needed for MVP) |

## 10. Environment Variables (see `.env.example`)
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` (Phase 2)
- `FRONTEND_URL` (for CORS + email links)


