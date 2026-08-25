# API Specification: InvoiceFlow

Base URL: `/api`
All protected routes require `Authorization: Bearer <access_token>` header.
All responses are JSON unless noted otherwise.

---

## 1. Auth

### POST /api/auth/register
Register a new user.
**Body:**
```json
{ "name": "Raj Pakhurde", "email": "raj@example.com", "password": "string", "companyName": "string (optional)" }
```
**Response 201:**
```json
{ "user": { "id": "uuid", "name": "string", "email": "string" }, "accessToken": "jwt" }
```
Sets refresh token as httpOnly cookie.

### POST /api/auth/login
**Body:** `{ "email": "string", "password": "string" }`
**Response 200:** same shape as register.

### POST /api/auth/refresh
Reads refresh token from httpOnly cookie, issues new access token.
**Response 200:** `{ "accessToken": "jwt" }`

### POST /api/auth/logout
Clears refresh token cookie.
**Response 200:** `{ "message": "Logged out" }`

### GET /api/auth/me  🔒
Returns current logged-in user profile.
**Response 200:** `{ "id", "name", "email", "companyName" }`

---

## 2. Clients  🔒 (all routes require auth)

### GET /api/clients
List all clients for logged-in user. Supports `?search=` query param.
**Response 200:** `[{ "id", "name", "email", "company", "address", "gstin", "createdAt" }]`

### GET /api/clients/:id
**Response 200:** single client object + invoice history summary.

### POST /api/clients
**Body:** `{ "name", "email", "company", "address", "gstin" }`
**Response 201:** created client object.

### PUT /api/clients/:id
**Body:** same fields as POST (partial allowed).
**Response 200:** updated client object.

### DELETE /api/clients/:id
**Response 204:** no content. (Reject if client has invoices — return 409 with message.)

---

## 3. Invoices  🔒

### GET /api/invoices
List all invoices for logged-in user. Supports query params:
`?status=draft|sent|paid|overdue`, `?clientId=`, `?page=`, `?limit=`
**Response 200:**
```json
{
  "data": [{ "id", "invoiceNumber", "clientName", "status", "total", "dueDate", "issueDate" }],
  "total": 42, "page": 1, "limit": 20
}
```

### GET /api/invoices/:id
**Response 200:** full invoice detail including line items and client info.

### POST /api/invoices
Create a new invoice (status defaults to "draft").
**Body:**
```json
{
  "clientId": "uuid",
  "issueDate": "2026-08-25",
  "dueDate": "2026-09-10",
  "taxPercent": 18,
  "items": [
    { "description": "Website development", "quantity": 1, "rate": 25000 }
  ],
  "notes": "string (optional)"
}
```
**Response 201:** created invoice object (invoiceNumber auto-generated, e.g. `INV-0001`).

### PUT /api/invoices/:id
Update invoice (only allowed if status is "draft").
**Body:** same shape as POST.
**Response 200:** updated invoice.

### DELETE /api/invoices/:id
Delete invoice (only allowed if status is "draft").
**Response 204.**

### PATCH /api/invoices/:id/status
Update invoice status manually.
**Body:** `{ "status": "sent" | "paid" | "overdue" }`
**Response 200:** updated invoice.

### GET /api/invoices/:id/pdf 🔒
Streams the generated PDF directly as the file response.
**Response 200:** `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="INV-0001.pdf"`
Returns binary PDF stream (not JSON).

### POST /api/invoices/:id/send
Generates PDF and emails it to the client's email on file. Sets status to "sent".
**Response 200:** `{ "message": "Invoice sent", "sentAt": "timestamp" }`

---

## 4. Expenses  🔒

### GET /api/expenses
List expenses. Supports `?category=`, `?startDate=`, `?endDate=`
**Response 200:** `[{ "id", "category", "amount", "date", "note" }]`

### POST /api/expenses
**Body:** `{ "category", "amount", "date", "note" }`
**Response 201:** created expense object.

### PUT /api/expenses/:id
**Body:** same as POST (partial allowed).
**Response 200:** updated expense.

### DELETE /api/expenses/:id
**Response 204.**

---

## 5. Dashboard  🔒

### GET /api/dashboard/summary
**Response 200:**
```json
{
  "totalOutstanding": 45000,
  "totalPaid": 120000,
  "totalExpenses": 30000,
  "netProfit": 90000,
  "invoiceCounts": { "draft": 2, "sent": 5, "paid": 10, "overdue": 1 }
}
```

### GET /api/dashboard/revenue-chart
Monthly revenue vs expenses for the last 12 months.
**Response 200:**
```json
[
  { "month": "2026-01", "revenue": 40000, "expenses": 8000 },
  { "month": "2026-02", "revenue": 55000, "expenses": 12000 }
]
```

---

## 6. Payments (Phase 2 — Razorpay)  🔒

### POST /api/invoices/:id/payment-link
Creates a Razorpay order for the invoice and returns a payment link.
**Response 200:** `{ "paymentLink": "https://rzp.io/...", "orderId": "order_xxx" }`

### POST /api/payments/webhook
Public route (Razorpay signature-verified, not JWT-protected).
Receives payment confirmation, verifies signature, updates matching invoice
status to "paid".
**Response 200:** `{ "received": true }`

---

## 7. Error Response Format (all endpoints)
```json
{ "error": { "message": "string", "code": "VALIDATION_ERROR | NOT_FOUND | UNAUTHORIZED | CONFLICT" } }
```

## 8. Status Codes Used
- 200 OK, 201 Created, 204 No Content
- 400 Bad Request (validation)
- 401 Unauthorized (missing/invalid token)
- 403 Forbidden (accessing another user's resource)
- 404 Not Found
- 409 Conflict (e.g. deleting client with invoices)
- 500 Internal Server Error
