# Fase 3: Agentes AI — Semanas 5-6

## Objetivo
Desplegar los agentes AI core y conectarlos a Make.com para automatización inteligente.

---

## Catálogo de Agentes

### Prioridad 1: Core Operativo (Semana 5)

| # | Agente | Función | Modelo Sugerido |
|---|--------|---------|-----------------|
| 1 | Ops Commander | Brief diario + excepciones | Claude/Gemini |
| 2 | Compatibility Assistant | Solo productos confirmados | Claude/Gemini |
| 3 | Client Support | Respuestas técnicas 24/7 | Claude/Gemini |
| 4 | Product Data Steward | Validación metafields | OSS/Gemini |

### Prioridad 2: Marketing + B2B (Semana 5-6)

| # | Agente | Función | Modelo Sugerido |
|---|--------|---------|-----------------|
| 5 | B2B Concierge | Área Profesional | Claude |
| 6 | Marketing Copy | Emails y landing | Claude |
| 7 | Educational Content | FAQs y guías | Gemini |

### Prioridad 3: Post-venta (Semana 6)

| # | Agente | Función | Modelo Sugerido |
|---|--------|---------|-----------------|
| 8 | Post-Sale Orchestrator | Secuencias | Claude |
| 9 | Review & Reputation | Reseñas | Claude |

---

## Configuración Multi-Model (Antigravity/Gateway)

```yaml
project: edplit-es-opsos
models:
  - name: claude_primary
    provider: anthropic
    use_for: [support, b2b, marketing, ops_commander]
  - name: gemini_primary
    provider: google_ai_studio
    use_for: [support_fallback, content, faq]
  - name: oss_classifier
    provider: open_source
    use_for: [classification, tagging, extraction]

routing:
  support:
    primary: claude_primary
    fallback: gemini_primary
  b2b_concierge:
    primary: claude_primary
  marketing_copy:
    primary: claude_primary
  data_validation:
    primary: oss_classifier

policies:
  - id: no_guess_compatibility
    rule: "If compat_confirmed != true, escalate"
  - id: no_false_promises
    rule: "Never promise delivery dates without tracking data"

logging:
  store: vps_postgres
  table: ai_agent_logs
```

---

## Implementación por Agente

### 1. Ops Commander

**Archivo:** `docs/agentes/01-ops-commander.md`

**Trigger:** Scheduler diario (08:00)

**Flujo:**
```
Make.com (08:00)
    ↓
API Vercel → Query ledger + Shopify
    ↓
Claude/Gemini → Genera brief
    ↓
Email → admin@edplit.es
```

**Output esperado:**
```
📊 MORNING BRIEF — 17 Enero 2026

🟢 ESTADO GENERAL: OK

PENDIENTES:
- 0 pedidos sin D0 email
- 0 reviews sin respuesta
- 0 SKUs incompletos

ALERTAS:
(ninguna)

MÉTRICAS:
- 12 pedidos ayer
- 3 reseñas nuevas (⭐ 4.8 promedio)
- 1 lead B2B (arquitecto Madrid)

PRÓXIMAS ACCIONES:
- Responder lead B2B (< 2h)
```

---

### 2. Compatibility Assistant

**Archivo:** `docs/agentes/03-compatibility-assistant.md`

**Trigger:** Chat web / Formulario

**Flujo:**
```
Input usuario: "Tengo Geberit UP320"
    ↓
API Vercel → Query Shopify metafields
    ↓
Claude → Filtra solo compat_confirmed=true
    ↓
Response: Lista de SKUs compatibles + links
```

**Regla crítica:**
> Si `compat_confirmed ≠ true`, NO recomendar. Pedir más info o escalar.

---

### 3. Client Support

**Archivo:** `docs/agentes/08-client-support.md`

**Trigger:** Chat web / Email support@

**Flujo:**
```
Pregunta cliente
    ↓
Claude → Busca en:
  • FAQs del SKU
  • Metafields (compatibilidad, instalación)
  • Tutoriales
    ↓
Respuesta + links a recursos
    ↓
Si no está seguro → Escalar a humano
```

---

## Conexión Make.com ↔ AI Agents

### Módulo HTTP en Make.com

```json
{
  "url": "https://edplit.es/api/ai/ops-commander",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer {{AI_API_KEY}}",
    "Content-Type": "application/json"
  },
  "body": {
    "action": "daily_brief",
    "date": "{{now}}"
  }
}
```

### Endpoint Vercel

```javascript
// api/ai/ops-commander.js
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  const { action, date } = req.body;
  
  // 1. Query data from ledger + Shopify
  const data = await getOpsData(date);
  
  // 2. Call Claude
  const client = new Anthropic();
  const response = await client.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 1024,
    system: OPS_COMMANDER_PROMPT,
    messages: [{ role: "user", content: JSON.stringify(data) }]
  });
  
  // 3. Return brief
  res.json({ brief: response.content[0].text });
}
```

---

## Logging de Agentes

```sql
CREATE TABLE ai_agent_logs (
    id              SERIAL PRIMARY KEY,
    agent_name      VARCHAR(50) NOT NULL,
    model           VARCHAR(50) NOT NULL,
    input_summary   TEXT,
    output_summary  TEXT,
    tokens_used     INTEGER,
    latency_ms      INTEGER,
    success         BOOLEAN,
    error_message   TEXT,
    created_at      TIMESTAMP DEFAULT NOW()
);
```

---

## Criterio de Éxito (Fase 3)

✅ Ops Commander envía brief diario
✅ Compatibility Assistant responde en chat
✅ Client Support resuelve preguntas FAQ
✅ B2B Concierge responde leads área profesional
✅ Todos los agentes tienen logging

---

## Siguiente → FASE 2+ (WhatsApp, Métricas)
