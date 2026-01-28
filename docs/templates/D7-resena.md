# Email D+7 — Solicitud de Reseña (Dual)

## Contexto
Se envía 7 días después de la entrega. Ofrece 2 opciones: reseña en web o en Google.

---

## Versión Email

### Asunto
`¿Nos dejas tu feedback? (30 segundos)`

### Preheader
`Tu opinión nos ayuda a mejorar`

### Cuerpo

```html
Hola {{nombre}},

Tu feedback nos ayuda muchísimo a mejorar EdPlit España y a que otros clientes compren con confianza.

---

Si te apetece, deja tu reseña donde prefieras (solo una opción, la que te sea más cómoda):

⭐ **Reseña del producto en nuestra web:**
{{link_review_web}}

⭐ **Reseña en Google (EdPlit España):**
{{link_review_google}}

---

Si prefieres no dejar reseña pública, también puedes responder a este email con tu experiencia (lo leemos todo).

Gracias,
**Equipo EdPlit España**

---

EdPlit España | edplit.es
{{link_unsub}}
```

---

## Versión WhatsApp (Fase 2)

```
Hola {{nombre}} 🙌

¿Nos dejas tu feedback?

Puedes elegir 1 opción:
📝 Reseña en la web: {{link_review_web}}
📝 O en Google: {{link_review_google}}

Gracias de verdad.
— Equipo EdPlit
```

---

## Variables

| Variable | Fuente | Ejemplo |
|----------|--------|---------|
| `{{nombre}}` | Shopify customer | "Carlos" |
| `{{link_review_web}}` | Shopify product review URL | "https://edplit.es/reviews/..." |
| `{{link_review_google}}` | Google Business review link | "https://g.page/r/..." |

---

## Gate
⚠️ **NO enviar si:**
- Existe ticket de soporte abierto
- Ya se envió este email (verificar ledger)
- Cliente solicitó no recibir emails de reseña
