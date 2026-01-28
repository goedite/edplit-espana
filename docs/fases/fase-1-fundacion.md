# Fase 1: Fundación — Semanas 1-2

## Objetivo
Establecer la infraestructura base: Shopify, Ledger anti-duplicados, y los 6 flujos mínimos de Make.com.

---

## Checklist de Implementación

### A. Shopify (Source of Truth)

#### A1. Configuración Base
- [ ] Crear cuenta Shopify (si no existe)
- [ ] Configurar pagos (Stripe/Shopify Payments)
- [ ] Configurar impuestos/IVA España
- [ ] Configurar zonas de envío:
  - España Península
  - Baleares
  - Canarias
  - Ceuta y Melilla

#### A2. Catálogo
- [ ] Crear productos/SKUs top 10
- [ ] Crear metafields por cada SKU:
  - `compat_space`
  - `compat_brand`
  - `compat_models`
  - `compat_confirmed`
  - `install_video_url`
  - `install_pdf_url`
  - `install_steps_summary`
  - `faq_block`
  - `recommended_tools`

#### A3. Emails Nativos
- [ ] DESACTIVAR emails post-venta de Shopify (los mandamos por Resend)
- [ ] Mantener solo: Confirmación de pago (opcional)

---

### B. VPS / Base de Datos

#### B1. PostgreSQL
```sql
-- Crear tabla ledger
CREATE TABLE message_ledger (
    id              SERIAL PRIMARY KEY,
    order_id        VARCHAR(50) NOT NULL,
    event_type      VARCHAR(50) NOT NULL,
    channel         VARCHAR(20) DEFAULT 'email',
    provider        VARCHAR(20) NOT NULL,
    recipient       VARCHAR(255) NOT NULL,
    idempotency_key VARCHAR(150) UNIQUE NOT NULL,
    status          VARCHAR(20) DEFAULT 'queued',
    sent_at         TIMESTAMP,
    meta            JSONB,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ledger_order ON message_ledger(order_id);
CREATE INDEX idx_ledger_idemp ON message_ledger(idempotency_key);
```

#### B2. API Endpoint (Vercel)
- [ ] Crear `/api/ops/check-ledger.js` — Verificar si mensaje ya enviado
- [ ] Crear `/api/ops/log-ledger.js` — Registrar mensaje enviado

---

### C. Resend (Transaccional)

- [ ] Verificar dominio `edplit.es`
- [ ] Configurar SPF, DKIM, DMARC
- [ ] Crear API key
- [ ] Probar envío desde Vercel

---

### D. Brevo (CRM)

- [ ] Verificar dominio
- [ ] Mantener automatización de bienvenida
- [ ] Crear tags:
  - `customer_paid`
  - `delivered`
  - `review_sent`
  - `review_received`
  - `b2b_quote_generated`

---

### E. Make.com — 6 Escenarios Mínimos

| Escenario | Trigger | Acción |
|-----------|---------|--------|
| S1 | Shopify order/paid | Resend: confirmación + links |
| S2 | Shopify fulfillment/created | Resend: tracking |
| S3 | Scheduler D+0 (delivered) | Resend: tutorial + PDF |
| S4 | Scheduler D+1 | Resend: checklist herramientas |
| S5 | Scheduler D+7 / D+14 | Resend: reseña dual + reminder |
| S6 | Scheduler diario 08:00 | Email admin: Ops Daily Recheck |

#### Lógica de cada escenario:
1. Recibir evento/scheduler
2. Llamar API `/api/ops/check-ledger.js`
3. Si NO existe → enviar por Resend
4. Llamar API `/api/ops/log-ledger.js`
5. Actualizar Brevo con tag/evento

---

### F. Google Workspace

- [ ] Crear alias (sin coste):
  - `orders@edplit.es`
  - `support@edplit.es`
  - `hola@edplit.es`
- [ ] Crear filtros/labels en Gmail
- [ ] Verificar que todo llega a admin@

---

## Criterio de Éxito (Fase 1)

✅ 10 pedidos de prueba:
- Email de confirmación sale 1 vez
- Email D+1 y D+7 salen 1 vez
- Si webhook duplicado → ledger evita duplicado
- Ops Daily Recheck llega a admin cada mañana

---

## Siguiente → [Fase 2: Website](./fase-2-website.md)
