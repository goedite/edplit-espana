# Arquitectura OpsOS — EdPlit España

## Diagrama de Flujo de Datos

```
                        ┌──────────────────┐
                        │   CLIENTE        │
                        │  (Web/Móvil)     │
                        └────────┬─────────┘
                                 │
                    ┌────────────▼────────────┐
                    │      EDPLIT.ES          │
                    │       (Vercel)          │
                    │                         │
                    │  • Home + Compatibility │
                    │  • Fichas Híbridas      │
                    │  • Hub Educativo        │
                    │  • Presupuestos         │
                    │  • Área Profesional     │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   SHOPIFY CHECKOUT      │
                    │   (Source of Truth)     │
                    │                         │
                    │  • Catálogo/SKUs        │
                    │  • Metafields           │
                    │  • Pagos/IVA            │
                    │  • Estados pedido       │
                    └────────────┬────────────┘
                                 │ Webhooks
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
    ┌────▼────┐            ┌─────▼─────┐           ┌─────▼─────┐
    │MAKE.COM │            │   RESEND  │           │   BREVO   │
    │Orquest. │───────────▶│   Trans.  │           │    CRM    │
    └────┬────┘            └───────────┘           └───────────┘
         │
         │ API calls
    ┌────▼────┐
    │   VPS   │
    │ Ledger  │
    │PostgreSQL│
    └─────────┘
```

---

## Metafields Obligatorios (Shopify)

### Compatibilidad
| Campo | Tipo | Ejemplo | Obligatorio |
|-------|------|---------|-------------|
| `compat_space` | Single line | Baño / Cocina / Electro | ✅ |
| `compat_brand` | Single line | Geberit / Grohe / TECE | ✅ |
| `compat_models` | List | UP320, UP720, Rapid | ✅ |
| `compat_confirmed` | Boolean | true | ✅ |

### Educación
| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| `install_video_url` | URL | Video instalación | ✅ |
| `install_pdf_url` | URL | PDF guía técnica | ✅ |
| `install_steps_summary` | Multi-line | 3-5 bullets | ✅ |
| `faq_block` | JSON | FAQ específica | ✅ |

### Profesionales
| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| `cad_dwg_url` | URL | Plano DWG | ⚠️ Si aplica |
| `cad_dxf_url` | URL | Plano DXF | ⚠️ Si aplica |
| `pro_notes` | Multi-line | Notas instalador | Opcional |

### Venta Llave en Mano
| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| `recommended_tools` | List (SKUs) | Herramientas necesarias | ✅ |

---

## Tabla message_ledger (VPS)

```sql
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

-- Índices
CREATE INDEX idx_ledger_order ON message_ledger(order_id);
CREATE INDEX idx_ledger_status ON message_ledger(status);
CREATE INDEX idx_ledger_idemp ON message_ledger(idempotency_key);

-- Ejemplo de idempotency_key
-- order_id + event_type + channel = "ORD-12345_delivered_d0_email"
```

### Event Types

| event_type | Descripción |
|------------|-------------|
| `order_paid` | Confirmación de pago |
| `order_fulfilled` | Pedido preparado |
| `delivered_d0` | Email día 0 (entrega) |
| `installready_d1` | Checklist día +1 |
| `review_d7` | Solicitud reseña día +7 |
| `reminder_d14` | Recordatorio día +14 |
| `referral_invite` | Invitación referidos |
| `b2b_quote` | Presupuesto B2B |

---

## Flujo de Separación Resend vs Brevo

```
                    ┌─────────────────┐
                    │   EVENTO        │
                    │ (Shopify/Make)  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ ¿Tipo de email? │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐         ┌────▼────┐         ┌────▼────┐
    │TRANSACC.│         │  CRM    │         │MARKETING│
    │         │         │         │         │         │
    │• Pagado │         │• Tags   │         │• Newsletter│
    │• Tracking│        │• Eventos│         │• Nurturing│
    │• D0/D+1 │         │         │         │• B2B follow│
    │• D+7/D+14│        │         │         │         │
    └────┬────┘         └────┬────┘         └────┬────┘
         │                   │                   │
         ▼                   ▼                   ▼
      RESEND              BREVO              BREVO
     (envía)            (registra)          (envía)
```

### Regla de Oro
> Un email NUNCA sale por los dos sistemas. Si sale por Resend, Brevo solo registra el evento.

---

## Configuración de Emails

### From addresses
| Tipo | Email | Uso |
|------|-------|-----|
| Transaccional | `orders@edplit.es` | Confirmaciones, tracking, post-venta |
| Soporte | `support@edplit.es` | Reply-to en todos los emails |
| Marketing | `hola@edplit.es` | Newsletters, nurturing |
| Admin | `admin@edplit.es` | Interno (nunca cliente) |

### Reply-to
Todos los emails post-venta deben tener `Reply-to: support@edplit.es` para centralizar.
