# 🛍️ GUÍA DE IMPLEMENTACIÓN SHOPIFY - EDPLIT ESPAÑA

## 📋 ÍNDICE
1. [Configuración Inicial Shopify](#1-configuración-inicial-shopify)
2. [Estructura de Productos](#2-estructura-de-productos)
3. [Integración con Web Actual](#3-integración-con-web-actual)
4. [Configuración de Pagos](#4-configuración-de-pagos)
5. [Configuración de Envíos](#5-configuración-de-envíos)
6. [Personalización del Tema](#6-personalización-del-tema)
7. [Migración de Productos](#7-migración-de-productos)
8. [SEO y Marketing](#8-seo-y-marketing)
9. [Operaciones y Automatización (Make + Notion)](#9-operaciones-y-automatización)
10. [Facturación B2B Automatizada](#10-facturacion-b2b)

---

## 1. CONFIGURACIÓN INICIAL SHOPIFY

### 🎯 **Paso 1.1: Crear Cuenta Shopify**

1. **Ir a:** https://www.shopify.com/es
2. **Registrarse:**
   - Email: info@edplit.es
   - Nombre de tienda: `edplit-espana` o `edplit-es`
   - URL temporal: `edplit-espana.myshopify.com`

3. **Prueba gratuita:** 3 días gratis + €1/mes durante 3 meses
4. **Plan recomendado:** Shopify Basic (€29/mes después de prueba)

### 🎯 **Paso 1.2: Configuración Básica**

```
Configuración > General:
├── Nombre de la tienda: EDPLIT España
├── Email de contacto: info@edplit.es
├── Dirección:
│   ├── Carrer de l'Exportació 37
│   ├── Polígon Sector Benieto
│   ├── 46702 Gandia, Valencia
│   └── España
├── Moneda: EUR (€)
├── Zona horaria: (GMT+01:00) Madrid
└── Unidad de peso: kg
```

---

## 2. ESTRUCTURA DE PRODUCTOS

### 📦 **Categorías (Collections)**

```
COLECCIONES PRINCIPALES:

1. PULSADORES OCULTOS
   ├── Por Marca de Cisterna
   │   ├── Geberit Sigma/Omega/AlcaPlast
   │   ├── Delta
   │   ├── TECE
   │   ├── OLI
   │   ├── Jomotech
   │   ├── Viega
   │   └── GROHE Rapid SL
   │
   ├── Por Modelo
   │   ├── M1 Invisi Tile Touch
   │   ├── M2 Invisi Tile Touch
   │   └── M3 InvisiFlush GROHE
   │
   └── Por Tipo
       ├── Con Consumibles
       └── Sin Consumibles

2. ENCHUFES E INTERRUPTORES
   ├── Marcos Ocultos EDPLIT
   ├── Mecanismos de Enchufe EDPLIT ONE
   └── Interruptores Invisibles

3. TOALLEROS ELÉCTRICOS
   ├── Toalleros Eléctricos Ocultos
   └── Accesorios para Toalleros

4. VENTILADORES
   ├── Sistemas de Montaje Oculto
   └── Ventiladores de Conducto

5. TAPAS DE REGISTRO
   └── Tapas Magnéticas Ocultas

6. ACCESORIOS
   ├── Consumibles
   ├── Herramientas de Instalación
   └── Kits Completos
```

### 🏷️ **Etiquetas (Tags) para Filtros**

```
Etiquetas por Compatibilidad:
- geberit
- sigma
- omega
- alcaplast
- delta
- tece
- oli
- jomotech
- viega
- grohe

Etiquetas por Características:
- con-consumibles
- sin-consumibles
- universal
- oculto
- premium
- nuevo
- bestseller

Etiquetas por Uso:
- baño
- cocina
- profesional
- residencial
```

---

## 3. INTEGRACIÓN CON WEB ACTUAL

### 🔗 **Opción A: Dominio Personalizado (Recomendado)**

**Usar tu dominio actual: edplit.es**

```
Shopify > Configuración > Dominios:
1. Añadir dominio existente: shop.edplit.es
2. Configurar DNS en Hostinger:
   
   Tipo: CNAME
   Nombre: shop
   Valor: shops.myshopify.com
   TTL: 3600
```

**Resultado:**
- Web informativa: `edplit.es` (tu web actual en Vercel)
- Tienda online: `shop.edplit.es` (Shopify)

### 🔗 **Opción B: Buy Button (Botón de Compra)**

**Integrar productos de Shopify en tu web actual**

1. **Shopify > Canales de venta > Buy Button**
2. **Crear botones para cada producto**
3. **Copiar código JavaScript**
4. **Insertar en tu web HTML actual**

**Ventajas:**
- Mantienes tu diseño actual
- Añades funcionalidad de carrito
- Checkout de Shopify
- Sin duplicar contenido

### 🔗 **Opción C: Headless Commerce (Avanzado)**

**Usar Shopify Storefront API**

```javascript
// Tu web actual (Vercel) consume API de Shopify
// Diseño 100% personalizado
// Checkout en Shopify
```

---

## 4. CONFIGURACIÓN DE PAGOS

### 💳 **Métodos de Pago Recomendados para España**

#### **A) Shopify Payments (Recomendado)**

```
Configuración > Pagos > Shopify Payments:
├── Tarjetas de crédito/débito
├── Apple Pay
├── Google Pay
└── Shop Pay

Comisiones:
├── Plan Basic: 1.9% + €0.25 por transacción
├── Plan Shopify: 1.8% + €0.25
└── Plan Advanced: 1.6% + €0.25

Sin comisiones adicionales de transacción
```

#### **B) Métodos Adicionales**

1. **PayPal Express**
   - Comisión: 2.9% + €0.35
   - Muy popular en España

2. **Bizum** (vía Redsys/MONEI)
   - App: MONEI o Redsys
   - Ideal para clientes españoles

3. **Transferencia Bancaria**
   - App: Manual Payment Methods
   - Para pedidos grandes (B2B)

4. **Contra Reembolso**
   - App: Cash on Delivery
   - Para clientes que prefieren pagar al recibir

---

## 5. CONFIGURACIÓN DE ENVÍOS

### 📦 **Zonas de Envío**

```
Configuración > Envíos y entrega:

ZONA 1: ESPAÑA PENINSULAR
├── Envío Estándar (3-5 días): €6.95
├── Envío Express (24-48h): €12.95
└── Envío Gratis: Pedidos > €150

ZONA 2: BALEARES Y CANARIAS
├── Envío Estándar (5-7 días): €12.95
└── Envío Express (3-5 días): €24.95

ZONA 3: PORTUGAL
├── Envío Estándar (5-7 días): €9.95
└── Envío Express (3-5 días): €19.95

ZONA 4: RESTO DE EUROPA
├── Envío Estándar (7-10 días): €19.95
└── Envío Express (5-7 días): €39.95
```

### 📦 **Transportistas Recomendados**

1. **SEUR** (España)
   - App: SEUR Shipping
   - Integración automática

2. **Correos Express**
   - App: Correos Express
   - Económico para España

3. **DHL Express**
   - App: DHL Express Commerce
   - Internacional

4. **Envialia**
   - App: Envialia Shipping
   - Buenas tarifas España

---

## 6. PERSONALIZACIÓN DEL TEMA

### 🎨 **Temas Recomendados**

#### **Opción 1: Dawn (Gratis - Recomendado)**
- Tema oficial de Shopify
- Rápido y moderno
- Muy personalizable
- Responsive perfecto

#### **Opción 2: Impulse (€350)**
- Diseño premium
- Ideal para productos técnicos
- Variantes avanzadas
- Lookbook integrado

#### **Opción 3: Prestige (€350)**
- Muy elegante
- Perfecto para productos premium
- Filtros avanzados
- Mega menú

### 🎨 **Personalización de Colores (Mantener Identidad EDPLIT)**

```css
/* Colores de tu web actual */
--primary: #3a3632;        /* Charcoal Brown */
--accent: #b8956e;         /* Warm Gold/Bronze */
--secondary: #faf8f5;      /* Off-White / Cream */
--text-primary: #2d2a26;   /* Deep contrast text */

/* Aplicar en Shopify Theme Editor */
Tema > Personalizar > Configuración del tema > Colores:
├── Color primario: #b8956e
├── Color de botones: #b8956e
├── Color de enlaces: #b8956e
├── Fondo: #faf8f5
└── Texto: #2d2a26
```

---

## 7. MIGRACIÓN DE PRODUCTOS

### 📊 **Preparar CSV de Productos**

**Estructura del CSV para importar:**

```csv
Handle,Title,Body (HTML),Vendor,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Status
m1-invisi-tile-touch-con-consumibles,M1 Invisi Tile Touch Universal CON Consumibles,"<p>Pulsador oculto universal compatible con 5 marcas de cisternas</p>",EDPLIT,Pulsadores,con-consumibles;universal;m1;geberit;sigma;omega;alcaplast;delta;tece,TRUE,Tipo de Cisterna,Universal (5 en 1),Consumibles,Con Consumibles,E10001,500,shopify,100,deny,manual,448.50,,TRUE,TRUE,,https://edplit.es/images/products/m1.jpg,1,Pulsador M1 Universal,FALSE,Pulsador Oculto M1 Universal - EDPLIT,Pulsador oculto M1 compatible con Geberit Sigma Omega AlcaPlast Delta TECE. Incluye consumibles.,Home & Garden > Bathroom > Bathroom Fixtures,,,E10001,Pulsadores,Premium,new,FALSE,Pulsadores,Con Consumibles,M1,Universal,Premium,,kg,,350.00,active
```

### 🔄 **Script de Conversión CSV**

Voy a crear un script Python para convertir tu CSV actual al formato de Shopify:

```python
# Ver archivo: convert_to_shopify_csv.py
```

---

## 8. SEO Y MARKETING

### 🔍 **Configuración SEO**

```
Configuración > Preferencias:

Título de la página de inicio:
"EDPLIT España - Pulsadores Ocultos y Soluciones de Baño Premium"

Meta descripción:
"Distribuidor oficial EDPLIT en España. Pulsadores ocultos, enchufes invisibles, toalleros eléctricos y ventiladores de diseño. Envío 24-48h."

Configuración > Dominios:
├── Dominio principal: shop.edplit.es
└── Redirección: edplit-espana.myshopify.com → shop.edplit.es
```

### 📱 **Canales de Venta Adicionales**

1. **Google Shopping**
   - App: Google & YouTube
   - Feed automático de productos
   - Anuncios de Shopping

2. **Facebook & Instagram**
   - App: Facebook & Instagram
   - Venta directa en redes sociales
   - Catálogo sincronizado

3. **Pinterest**
   - App: Pinterest
   - Ideal para productos de diseño

---

## 💰 COSTES TOTALES ESTIMADOS

### **Costes Mensuales:**
```
Shopify Basic:              €29/mes
Apps recomendadas:          €20-50/mes
  ├── Redsys/MONEI (Bizum): €15/mes
  ├── Reviews app:          €10/mes
  └── SEO app:              €10/mes

TOTAL MENSUAL:              €49-79/mes
```

### **Costes por Transacción:**
```
Shopify Payments:           1.9% + €0.25
PayPal (si se usa):         2.9% + €0.35
```

### **Costes Únicos (Opcionales):**
```
Tema Premium:               €0-350 (una vez)
Configuración profesional:  €500-1500 (una vez)
Fotografía de productos:    €500-2000 (una vez)
```

---

## 🚀 PLAN DE IMPLEMENTACIÓN (4 SEMANAS)

### **SEMANA 1: Configuración Base**
- [ ] Crear cuenta Shopify
- [ ] Configurar información básica
- [ ] Configurar dominio shop.edplit.es
- [ ] Instalar tema (Dawn o Premium)
- [ ] Personalizar colores y tipografía

### **SEMANA 2: Productos y Colecciones**
- [ ] Convertir CSV a formato Shopify
- [ ] Importar productos
- [ ] Crear colecciones
- [ ] Configurar variantes
- [ ] Añadir imágenes de productos
- [ ] Configurar etiquetas y filtros

### **SEMANA 3: Pagos y Envíos**
- [ ] Activar Shopify Payments
- [ ] Configurar PayPal
- [ ] Instalar app Bizum (MONEI/Redsys)
- [ ] Configurar zonas de envío
- [ ] Integrar transportistas
- [ ] Configurar impuestos (IVA)

### **SEMANA 4: Testing y Lanzamiento**
- [ ] Realizar pedidos de prueba
- [ ] Verificar emails automáticos
- [ ] Configurar políticas (devoluciones, privacidad)
- [ ] Configurar Google Analytics
- [ ] Configurar Facebook Pixel
- [ ] Lanzamiento oficial
- [ ] Promoción en redes sociales

---

## 🔗 INTEGRACIÓN CON WEB ACTUAL

### **Opción Recomendada: Dual Website**

```
edplit.es (Vercel - Web Informativa)
├── Inicio
├── Sobre Nosotros
├── Proyectos
├── Blog/Noticias
└── Contacto

shop.edplit.es (Shopify - Tienda Online)
├── Catálogo de Productos
├── Carrito
├── Checkout
└── Mi Cuenta
```

### **Navegación Integrada:**

En tu web actual (edplit.es), añadir en el menú:
```html
<nav>
  <a href="/">Inicio</a>
  <a href="/proyectos">Proyectos</a>
  <a href="https://shop.edplit.es">Tienda Online</a>
  <a href="/contacto">Contacto</a>
</nav>
```

En Shopify (shop.edplit.es), añadir en el menú:
```
Inicio (shop.edplit.es)
Catálogo
Sobre Nosotros (edplit.es/sobre-nosotros)
Proyectos (edplit.es/proyectos)
Contacto (edplit.es/contacto)
```

---

## 📞 SOPORTE Y RECURSOS

### **Recursos Oficiales:**
- Shopify Help Center: https://help.shopify.com/es
- Shopify Community: https://community.shopify.com/
- Shopify Academy: https://www.shopify.com/es/academy

### **Apps Recomendadas:**

1. **Judge.me** (Reviews): Gratis
2. **MONEI** (Bizum): €15/mes
3. **Plug in SEO**: €20/mes
4. **Klaviyo** (Email Marketing): Gratis hasta 250 contactos
5. **Loox** (Photo Reviews): €10/mes

---

## ✅ CHECKLIST FINAL ANTES DE LANZAR

- [ ] Todos los productos importados
- [ ] Imágenes de alta calidad
- [ ] Descripciones completas
- [ ] Precios correctos (IVA incluido)
- [ ] Métodos de pago funcionando
- [ ] Zonas de envío configuradas
- [ ] Políticas legales (privacidad, devoluciones, términos)
- [ ] Emails de confirmación personalizados
- [ ] Google Analytics instalado
- [ ] Pedido de prueba completado
- [ ] Dominio personalizado activo
- [ ] Certificado SSL activo
- [ ] Favicon y logo correctos
- [ ] Redes sociales enlazadas

---

---

## 9. OPERACIONES Y AUTOMATIZACIÓN (MAKE + NOTION)

Esta es la "inteligencia" que conecta la tienda con el almacén sin errores manuales.

### 🧩 **Arquitectura del Sistema**
1. **Fuente de Verdad (Pagos):** Shopify
2. **Tablero de Operaciones:** Notion (Base de datos de Logística)
3. **Cerebro (Pegamento):** Make.com
4. **Archivo de Documentos:** Google Drive

### � **Ubicaciones en Shopify (Locations)**
1. **Almacén Gandía (España):** Stock físico real - Envío 24-48h
2. **Fábrica EDPLIT (Ucrania):** Productos bajo pedido - Fabricación 7-12 días

### �🛠️ **Flujo de Trabajo Automatizado (Paso a Paso)**

| Disparador (Trigger) | Lógica (Make) | Acción Resultante |
| :--- | :--- | :--- |
| **Pago en Shopify** | Filtra por Tags (via script CSV) | Crea Tarea en Notion + Tag Logístico |
| **Cambio a "EMBALAJE"** | Ninguna (Visual) | El almacén prepara el paquete |
| **Cambio a "ENVIADO"** | Dispara Webhook | Actualiza Shopify con Tracking + Envía Mail |
| **Pedido B2B Detectado** | Valida CIF/NIF | Genera Factura PDF en Drive + Envío Automático |

### 📋 **Tablero de Notion Recomendado (Estados)**
Configuraremos una base de datos en Notion con estas columnas:
- `Pedido`: #1001 (Enlace a Shopify)
- `Estado`: Seleccionable (POR PREPARAR, EMBALAJE, ETICKETADO, ENVIADO, BAJO PEDIDO)
- `Tipo Logística`: STOCK_ES | MIXTO | BAJO_PEDIDO
- `Cliente`: Nombre + Email
- `Tracking`: Texto (Cargado por almacén)
- `Factura`: Enlace al PDF generado en Drive

---

## 10. FACTURACIÓN B2B AUTOMATIZADA

Para eliminar la carga administrativa de la gestoría:

### 📑 **Proceso de Generación**
1. **Detección:** Si el pedido tiene datos fiscales (CIF/NIF) cargados en el carrito.
2. **Generación:** Make usa una plantilla de **Google Docs** con tu diseño corporativo.
3. **Numeración:** Gestionada en una **Google Sheet** (Libro de Facturas) para evitar saltos o duplicados.
4. **Almacenamiento:** PDF guardado en `/EDPLIT-FACTURAS/2026/FEBRERO/`.
5. **Entrega:** Email automático al cliente: *"Aquí tienes tu factura del pedido #1234"*.

---

## 🛠️ SETUP INMEDIATO (SIN FRICCIÓN)

Para empezar **YA** sin programar el panel de Vercel:

1. **Notion:** Creamos un tablero Kanban sencillo para el almacén.
2. **Notificación:** Email automático a `almacen@edplit.es` cada vez que hay un pago confirmado.
3. **Make:** 2 escenarios básicos (Shopify → Notion) y (Notion "Enviado" → Shopify).
4. **Drive:** Carpeta compartida con la gestoría para que descarguen los PDFs a final de mes.

---

**Fecha de actualización:** 2026-02-04
**Versión:** 1.1
**Estado:** Arquitectura de Automatización Definida
