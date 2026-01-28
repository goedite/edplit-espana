# Flujos Make.com — Especificaciones

## Visión General

| Escenario | Trigger | Acción Principal |
|-----------|---------|------------------|
| S1 | Shopify order/paid | Email confirmación |
| S2 | Shopify fulfillment/created | Email tracking |
| S3 | Delivered (o D+2) | Email D0 tutorial |
| S4 | Scheduler D+1 | Email checklist |
| S5 | Scheduler D+7/D+14 | Email reseña |
| S6 | Scheduler 08:00 | Ops Daily Recheck |

---

## S1 — Order Paid

### Trigger
Webhook: Shopify `orders/paid`

### Flujo
```
[Webhook Shopify]
      ↓
[HTTP: Check Ledger]
  POST /api/ops/check-ledger
  Body: { order_id, event_type: "order_paid" }
      ↓
[Router: ¿Ya enviado?]
  ├─ SÍ → Terminar
  └─ NO → Continuar
      ↓
[HTTP: Get Order Details]
  GET /api/shopify/order/{{order_id}}
      ↓
[Resend: Send Email]
  Template: "order_confirmation"
  To: {{customer_email}}
      ↓
[HTTP: Log Ledger]
  POST /api/ops/log-ledger
  Body: { order_id, event_type, status: "sent" }
      ↓
[HTTP: Update Brevo]
  POST /api/brevo/tag
  Body: { email, tag: "customer_paid" }
```

---

## S3 — Delivered D0

### Trigger
Webhook: Tracking "delivered" O Scheduler diario (buscar pedidos D+2)

### Flujo
```
[Trigger]
      ↓
[HTTP: Get Delivered Orders]
  GET /api/ops/delivered-yesterday
      ↓
[Iterator: For each order]
      ↓
[HTTP: Check Ledger]
  event_type: "delivered_d0"
      ↓
[Filter: ¿Ya enviado?]
  ├─ SÍ → Skip
  └─ NO → Continuar
      ↓
[HTTP: Check Open Tickets]
  GET /api/support/tickets?order_id={{order_id}}
      ↓
[Filter: ¿Ticket abierto?]
  ├─ SÍ → Skip + Log "paused"
  └─ NO → Continuar
      ↓
[HTTP: Get Product Metafields]
  GET /api/shopify/product/{{sku}}/metafields
      ↓
[Resend: Send Email]
  Template: "D0_delivered"
  Variables: { video_url, pdf_url, compatibility }
      ↓
[HTTP: Log Ledger]
```

---

## S5 — Review D+7

### Trigger
Scheduler diario (09:00)

### Flujo
```
[Scheduler 09:00]
      ↓
[HTTP: Get Orders Delivered 7 Days Ago]
  GET /api/ops/orders-delivered?days_ago=7
      ↓
[Iterator: For each order]
      ↓
[HTTP: Check Ledger]
  event_type: "review_d7"
      ↓
[Filter: ¿Ya enviado?]
  ├─ SÍ → Skip
  └─ NO → Continuar
      ↓
[HTTP: Check Open Tickets]
      ↓
[Filter: ¿Ticket abierto?]
  ├─ SÍ → Skip
  └─ NO → Continuar
      ↓
[Resend: Send Email]
  Template: "D7_review_request"
  Variables: { review_web_url, review_google_url }
      ↓
[HTTP: Log Ledger]
      ↓
[HTTP: Update Brevo]
  Tag: "review_sent"
```

---

## S6 — Ops Daily Recheck

### Trigger
Scheduler diario (08:00)

### Flujo
```
[Scheduler 08:00]
      ↓
[HTTP: Get Ops Data]
  GET /api/ops/daily-check
  Returns:
    - orders_without_d0
    - orders_without_review_ask
    - reviews_without_response
    - skus_incomplete
    - open_tickets
      ↓
[HTTP: Call Ops Commander GPT]
  POST /api/ai/ops-commander
  Body: { action: "morning_brief", data: {{ops_data}} }
      ↓
[Gmail: Send Email]
  To: admin@edplit.es
  Subject: "📊 Ops Brief — {{date}}"
  Body: {{ai_response}}
```

---

## API Endpoints Necesarios (Vercel)

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/ops/check-ledger` | POST | Verificar si mensaje ya enviado |
| `/api/ops/log-ledger` | POST | Registrar mensaje enviado |
| `/api/ops/delivered-yesterday` | GET | Pedidos entregados ayer |
| `/api/ops/orders-delivered` | GET | Pedidos entregados hace N días |
| `/api/ops/daily-check` | GET | Datos para Ops Commander |
| `/api/shopify/order/:id` | GET | Detalles de pedido |
| `/api/shopify/product/:sku/metafields` | GET | Metafields de producto |
| `/api/support/tickets` | GET | Tickets por order_id |
| `/api/brevo/tag` | POST | Añadir tag a contacto |
| `/api/ai/ops-commander` | POST | Llamar Ops Commander GPT |
