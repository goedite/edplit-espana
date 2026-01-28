# Fase 2: Website — Semanas 3-4

## Objetivo
Implementar la UX "compatibility-first" y fichas híbridas con educación incrustada.

---

## Checklist de Implementación

### A. Home — Widget de Compatibilidad

#### A1. Componente
```html
<!-- Selector de compatibilidad -->
<div class="compatibility-widget">
  <h2>¿Qué sistema tienes instalado?</h2>
  
  <div class="step step-1">
    <label>Espacio</label>
    <select id="compat-space">
      <option value="">Selecciona...</option>
      <option value="bano">Baño</option>
      <option value="cocina">Cocina</option>
      <option value="electro">Electro</option>
    </select>
  </div>
  
  <div class="step step-2">
    <label>Marca del sistema</label>
    <select id="compat-brand">
      <option value="">Selecciona...</option>
      <option value="geberit">Geberit</option>
      <option value="grohe">Grohe</option>
      <option value="tece">TECE</option>
      <option value="otros">Otros</option>
    </select>
  </div>
  
  <button class="cta-primary" onclick="showCompatible()">
    Ver productos compatibles →
  </button>
</div>
```

#### A2. Lógica
- [ ] Filtrar productos por metafields `compat_space` + `compat_brand`
- [ ] Mostrar solo productos con `compat_confirmed = true`
- [ ] Redirigir a página de resultados filtrados

---

### B. Fichas de Producto (PDP Híbrida)

#### B1. Estructura
```
┌─────────────────────────────────────────────┐
│  [Galería imágenes]    [Info producto]      │
│                        • Título             │
│                        • ✅ Compatible con   │
│                        • Precio             │
│                        • [Añadir al carrito]│
├─────────────────────────────────────────────┤
│  ▶️ VIDEO INSTALACIÓN (2 min)               │
│  [Video nativo incrustado, no link]         │
├─────────────────────────────────────────────┤
│  [Tabs]                                     │
│  • Especificaciones | Instalación | Envíos  │
├─────────────────────────────────────────────┤
│  🧰 HERRAMIENTAS NECESARIAS                 │
│  [Cross-sell bundle]                        │
├─────────────────────────────────────────────┤
│  📄 DOCUMENTOS                              │
│  • PDF Guía técnica                         │
│  • DWG/DXF (si aplica)                     │
└─────────────────────────────────────────────┘
```

#### B2. Indicador de Compatibilidad
```html
<div class="compatibility-badge">
  ✅ Compatible con: 
  <strong>Geberit UP320, UP720</strong>
</div>
```

#### B3. Video Nativo
- [ ] Usar `<video>` o embed (YouTube/Vimeo)
- [ ] Autoplay: NO
- [ ] Visible above the fold o justo debajo
- [ ] Thumbnail atractivo

#### B4. Cross-sell Herramientas
- [ ] Mostrar productos de `recommended_tools`
- [ ] Botón "Añadir todo" para bundle
- [ ] Nota: "Para instalación perfecta"

---

### C. Hub Educativo

#### C1. Página /tutoriales
- [ ] Lista de tutoriales por categoría
- [ ] Filtro por marca/sistema
- [ ] Enlace desde cada ficha de producto

#### C2. Página /proyectos
- [ ] Galería de proyectos reales (UGC)
- [ ] Filtro por ciudad/material/sistema
- [ ] "¿Quieres que tu proyecto aparezca aquí?" CTA

---

### D. Área Profesional

#### D1. Landing /area-profesional
```
┌─────────────────────────────────────────────┐
│  ÁREA PROFESIONAL                           │
│  Para arquitectos e instaladores            │
├─────────────────────────────────────────────┤
│  BENEFICIOS:                                │
│  • Tarifas especiales por volumen           │
│  • Muestras gratuitas                       │
│  • Soporte prioritario                      │
│  • Acceso a planos CAD/DWG                  │
│  • Pack de fichas técnicas                  │
├─────────────────────────────────────────────┤
│  FORMULARIO:                                │
│  • Nombre empresa                           │
│  • CIF / Nº colegiado                       │
│  • Email profesional                        │
│  • Teléfono                                 │
│  • Tipo: Arquitecto / Instalador / Otro    │
│                                             │
│  [Solicitar acceso →]                       │
└─────────────────────────────────────────────┘
```

#### D2. Validación
- [ ] Conectar formulario a Brevo (tag: `b2b_lead`)
- [ ] Webhook a Make.com para B2B Concierge GPT
- [ ] Email automático con pack de bienvenida

---

### E. Generador de Presupuestos

- [ ] Integrar `presupuestos.html` existente
- [ ] Al generar presupuesto:
  - Crear contacto en Brevo (tag: `quote_generated`)
  - Email con resumen + links compatibilidad
  - Si no compra en 3 días → follow-up

---

## Criterio de Éxito (Fase 2)

✅ Widget compatibilidad funciona
✅ Fichas tienen video nativo visible
✅ Cross-sell de herramientas aparece
✅ PDFs/CAD descargables
✅ Área Profesional genera leads en Brevo
✅ Presupuestos disparan automatización

---

## Siguiente → [Fase 3: Agentes AI](./fase-3-agentes.md)
