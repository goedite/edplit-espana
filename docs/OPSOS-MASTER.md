# EdPlit España — OpsOS Master Guide
## Sistema Operativo AI-First (2026–2030)

> **Objetivo**: Crear un sistema operativo de operaciones que evite cuellos de botella, reduzca errores humanos y mantenga el día "perfecto y en orden", incluso con crecimiento rápido (+30% en 2 meses).

---

## 📌 Principios Fundamentales

| Principio | Descripción |
|-----------|-------------|
| **Compatibility-first** | El usuario compra por compatibilidad, no por diseño |
| **Educación incrustada** | Video de instalación nativo en cada ficha (no enlace externo) |
| **Llave en mano** | Cross-sell de herramientas necesarias |
| **Doble carril** | B2C (cliente final) + B2B (Área Profesional) |
| **Anti-errores** | Gates por estado + ledger idempotente + auto-recheck diario |

---

## 🏗️ Arquitectura Híbrida

```
┌─────────────────────────────────────────────────────────────┐
│                    EDPLIT.ES (Vercel)                       │
│  • Compatibility Widget  • Hub Educativo  • Presupuestos   │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐      ┌─────▼─────┐     ┌─────▼─────┐
    │ SHOPIFY │      │  MAKE.COM │     │    VPS    │
    │Checkout │      │Orquestador│     │  Ledger   │
    └────┬────┘      └─────┬─────┘     └─────┬─────┘
         │                 │                 │
         │           ┌─────┼─────┐           │
         │           │     │     │           │
         │      ┌────▼─┐ ┌─▼──┐ ┌▼────┐      │
         │      │Resend│ │Brevo│ │AI   │      │
         │      │Trans.│ │CRM  │ │Agents│     │
         │      └──────┘ └────┘ └─────┘      │
         │                                   │
         └───────────────────────────────────┘
                    message_ledger
```

### Componentes

| Componente | Función | Tecnología |
|------------|---------|------------|
| **Source of Truth** | Pedidos, pagos, reembolsos | Shopify Checkout |
| **Frontend** | Web, compatibilidad, educación | Vercel |
| **Orquestador** | Webhooks, routing, flujos | Make.com |
| **Transaccional** | Emails post-venta por estado | Resend |
| **CRM/Marketing** | Bienvenida, nurturing, B2B | Brevo |
| **Anti-duplicados** | Ledger idempotente | PostgreSQL (VPS) |
| **AI Agents** | 18 agentes especializados | Claude/Gemini/OSS |

---

## 🔄 Ciclo Operativo

```
Marketing → Pedido → Ukraine Warehouse → Valencia/Gandía → Entrega
     ↑                                                      ↓
     └──── Repetición ← Referidos ← Reseñas ← Post-venta ←─┘
```

### Estados del Pedido (Gates)

| Estado | Trigger | Gate (no avanzar si...) |
|--------|---------|-------------------------|
| Order Created | Cliente compra | Validación datos/compatibilidad |
| Payment Captured | Pago confirmado | — |
| UA Notified | Webhook a Ucrania | Debe existir Dispatch ID |
| In Transit ES | Envío en camino | Tracking activo |
| Received Gandía | Llegada a Valencia | QA completado |
| Ready to Ship | Preparado | Etiqueta + courier |
| Shipped | Enviado | Tracking enviado al cliente |
| Delivered | Entregado | — |

---

## 📊 Fases de Implementación

### FASE 1: Fundación (Semanas 1-2)
- [ ] Shopify: catálogo + metafields + checkout
- [ ] VPS: tabla `message_ledger`
- [ ] Make.com: 6 escenarios (S1–S6)
- [ ] Resend + Brevo: configuración separada
- [ ] Reviews: Google + Web

### FASE 2: Website (Semanas 3-4)
- [ ] Widget de compatibilidad (Home)
- [ ] Fichas híbridas (video + PDFs + tabs)
- [ ] Área Profesional
- [ ] Generador de presupuestos integrado

### FASE 3: Agentes AI (Semanas 5-6)
- [ ] Desplegar agentes core
- [ ] Conectar a Make.com
- [ ] Daily Ops Commander report

### FASE 2+ (Cuando haya tracción)
- [ ] WhatsApp Business API
- [ ] Panel de métricas
- [ ] Automatización logística avanzada

---

## 📁 Estructura de Documentación

```
docs/
├── OPSOS-MASTER.md          ← Este documento
├── arquitectura.md          ← Diagramas detallados
├── fases/
│   ├── fase-1-fundacion.md
│   ├── fase-2-website.md
│   └── fase-3-agentes.md
├── agentes/                  ← 18 prompts GPT
│   ├── 01-ops-commander.md
│   ├── 02-product-data-steward.md
│   └── ...
├── flows/                    ← Especificaciones Make.com
│   ├── S1-order-paid.md
│   └── ...
└── templates/                ← Plantillas de email
    ├── D0-entregado.md
    └── ...
```

---

## 🤖 Catálogo de Agentes (18 total)

### Operaciones Core (13)
1. **Ops Commander** — Brief diario + excepciones
2. **Product Data Steward** — Metafields completos
3. **Compatibility Assistant** — Solo compatibles confirmados
4. **Educational Content** — Tutorial/FAQ/PDF por SKU
5. **Marketing Copy** — Emails y landing copy
6. **Social Scheduler** — Posts semanales
7. **B2B Concierge** — Área Profesional
8. **Client Support** — Respuestas + escalado
9. **Logistics Notifier UA** — Webhook a Ucrania
10. **Inventory Sync** — Stock 3 ubicaciones
11. **Receiving & QA Gandía** — Control recepción
12. **Courier & Tracking** — Última milla
13. **Payment Flow Watcher** — Cobro en momento correcto

### Post-venta (5)
14. **Post-Sale Orchestrator** — Secuencias por estado
15. **Review & Reputation** — Reseñas + respuestas
16. **UGC/Proyectos Collector** — Fotos + permisos
17. **Referral Engine** — Códigos + tracking
18. **Retention & Winback** — Repetición inteligente

---

## ✅ Reglas Anti-Error (10 mandamientos)

1. No publicar SKU activo si faltan campos obligatorios
2. Compatibilidad `confirmed=true` o no se recomienda
3. Tickets abiertos pausan review/referral
4. Solo 1 reminder de reseña
5. Todo evento genera log (orderID + eventType)
6. Idempotencia: no enviar 2 veces el mismo mensaje
7. Fallback: si email rebota → alerta RED
8. Reseñas negativas → respuesta pública + caso interno
9. Preguntas repetidas → actualizar FAQ/tutorial
10. Reporte diario obligatorio (aunque no haya incidencias)

---

## 🚦 Semáforo Operativo

| Nivel | Definición | Acción |
|-------|------------|--------|
| 🟢 Green | Todo correcto | Solo reportar resumen |
| 🟠 Orange | Riesgo moderado | Auto-intento + notificación |
| 🔴 Red | Problema crítico | Escalada inmediata + contención |

---

## 📚 Referencias

- [Arquitectura detallada](./arquitectura.md)
- [Fase 1: Fundación](./fases/fase-1-fundacion.md)
- [Catálogo de Agentes](./agentes/)
- [Flujos Make.com](./flows/)
- [Plantillas Email](./templates/)
