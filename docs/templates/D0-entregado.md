# Email D0 — Pedido Entregado

## Contexto
Se envía cuando el pedido marca estado "Delivered" (o D+2 estimado si no hay tracking fiable).

---

## Versión Email

### Asunto
`Tu pedido EdPlit ya está entregado ✅`

### Preheader
`Instalación clara, resultado invisible.`

### Cuerpo

```html
Hola {{nombre}},

Tu pedido #{{order_id}} ya aparece como entregado.

Para que la instalación sea perfecta desde el primer minuto, aquí tienes lo más importante:

▶️ **Tutorial de instalación (2 min):** {{link_tutorial}}

📄 **Ficha técnica / Guía:** {{link_pdf}}

🧩 **Compatibilidad confirmada:** {{compatibilidad}}

---

Si necesitas ayuda técnica, responde a este email y te guiamos paso a paso.

Un saludo,
**Equipo EdPlit España**

---

EdPlit España | edplit.es
{{link_unsub}}
```

---

## Versión WhatsApp (Fase 2)

```
Hola {{nombre}} 👋

Tu pedido EdPlit #{{order_id}} está entregado ✅

Aquí tienes el tutorial (2 min):
{{link_tutorial}}

Si necesitas ayuda, responde por aquí.

— Equipo EdPlit
```

---

## Variables

| Variable | Fuente | Ejemplo |
|----------|--------|---------|
| `{{nombre}}` | Shopify customer | "María" |
| `{{order_id}}` | Shopify order | "ORD-12345" |
| `{{link_tutorial}}` | Metafield `install_video_url` | "https://..." |
| `{{link_pdf}}` | Metafield `install_pdf_url` | "https://..." |
| `{{compatibilidad}}` | Metafield `compat_brand` + `compat_models` | "Geberit UP320" |

---

## Gate
⚠️ **NO enviar si:**
- Existe ticket de soporte abierto para este pedido
- Ya se envió (verificar ledger)
