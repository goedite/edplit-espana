# Estructura de Imágenes - EDPLIT España

## 📁 Organización de Carpetas

### `/images/logo/`
Coloca aquí el logotipo de EDPLIT España en diferentes formatos:
- `logo.svg` - Logotipo principal (formato vectorial)
- `logo.png` - Logotipo en PNG con fondo transparente
- `logo-dark.svg` - Versión para fondos oscuros
- `logo-light.svg` - Versión para fondos claros
- `favicon.ico` - Favicon para el navegador

**Recomendaciones:**
- Formato SVG preferido para escalabilidad
- PNG con transparencia para compatibilidad
- Tamaño recomendado: logo principal mínimo 200px de ancho

---

### `/images/products/`
Fotos de los productos por categoría:

**Pulsadores:**
- `invisiflush-m1.jpg`
- `invisiflush-m2.jpg`
- `invisiflush-m3.jpg`

**Enchufes:**
- `invisocket.jpg`
- `invisiswitch.jpg`
- `combo-socket-switch.jpg`

**Ventiladores:**
- `stealthflow-100.jpg`
- `stealthflow-125.jpg`
- `stealthflow-150.jpg`

**Tapas de Registro:**
- `tilefusion-s.jpg`
- `tilefusion-m.jpg`
- `tilefusion-l.jpg`

**Toalleros:**
- `hidden-hook.jpg`
- `hidden-bar-40.jpg`
- `hidden-bar-60.jpg`

**Recomendaciones:**
- Formato: JPG o WebP (mejor rendimiento)
- Tamaño: 800x800px mínimo (cuadradas)
- Fondo: Blanco o transparente si es PNG
- Calidad: Alta, optimizada para web

---

### `/images/hero/`
Imágenes principales para la sección hero:
- `hero-main.jpg` - Imagen principal del hero (1920x1080px)
- `hero-mobile.jpg` - Versión para móviles (750x1334px)
- `bathroom-showcase.jpg` - Baño de ejemplo instalado

**Recomendaciones:**
- Alta calidad, optimizadas
- Mostrar el producto instalado en contexto real
- Iluminación profesional
- Fondos minimalistas que complementen la paleta crema/beige

---

### `/images/gallery/`
Galería de proyectos instalados:
- `project-01.jpg`
- `project-02.jpg`
- `project-03.jpg`
- etc.

**Recomendaciones:**
- Fotos de instalaciones reales
- Diferentes ángulos y ambientes
- Formato landscape preferentemente
- Tamaño: 1920x1080px o 1200x800px

---

## 🎨 Guía de Estilo Fotográfico

### Paleta de Colores
Las fotos deben complementar la paleta del sitio:
- Tonos cálidos: crema, beige, blancos suaves
- Materiales: cerámica, piedra natural, madera clara
- Evitar colores fríos o muy saturados

### Composición
- Minimalista y limpia
- Foco en el producto/instalación
- Buena iluminación natural o cálida
- Perspectivas arquitectónicas

### Formatos Recomendados
- **JPG**: Para fotos con muchos colores
- **WebP**: Para mejor compresión (preferido)
- **PNG**: Solo si necesitas transparencia
- **SVG**: Solo para logotipos e iconos

---

## 📝 Instrucciones de Uso

### Para añadir el logotipo:

1. Coloca tu archivo de logo en `/images/logo/`
2. Actualiza el HTML en la sección de navegación:

```html
<div class="logo">
    <a href="#"><img src="images/logo/logo.svg" alt="edplit.es"></a>
</div>
```

### Para añadir fotos de productos:

1. Coloca las fotos en `/images/products/`
2. Actualiza el HTML de cada producto:

```html
<div class="product-card">
    <img src="images/products/invisiflush-m1.jpg" alt="InvisiFlush M1" class="product-image">
    <h4>InvisiFlush M1</h4>
    <!-- resto del contenido -->
</div>
```

### Para añadir imagen hero:

1. Coloca la imagen en `/images/hero/`
2. Actualiza el CSS o HTML:

```html
<div class="hero-image">
    <img src="images/hero/hero-main.jpg" alt="EDPLIT baño minimalista">
</div>
```

---

## ⚡ Optimización de Imágenes

Antes de subir las imágenes, asegúrate de:

1. **Comprimir**: Usa herramientas como TinyPNG, Squoosh o ImageOptim
2. **Redimensionar**: Ajusta al tamaño exacto necesario
3. **Formato correcto**: WebP para web moderna, JPG para compatibilidad
4. **Nombres descriptivos**: Usa nombres claros y en minúsculas con guiones

---

## 📦 Carpetas Creadas

```
edplit-updated/
├── images/
│   ├── logo/          ← Logotipos aquí
│   ├── products/      ← Fotos de productos aquí
│   ├── hero/          ← Imágenes principales aquí
│   └── gallery/       ← Galería de proyectos aquí
```

**¡Listo para usar!** Solo arrastra tus archivos de imagen a las carpetas correspondientes.
