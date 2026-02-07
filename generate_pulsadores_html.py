#!/usr/bin/env python3
"""
Generador de HTML para TODOS los pulsadores organizados
"""

# Productos CON consumibles (ordenados por precio descendente)
con_consumibles = [
    ('E10001', 'M1 Invisi Tile Touch Universal', '5 en 1: Sigma, Omega, AlcaPlast, Delta, Tece', 448.50),
    ('E10005', 'M2 Invisi Tile Touch Universal', '5 en 1: Sigma, Omega, AlcaPlast, Delta, Tece', 448.50),
    ('E10002', 'M1 para Sigma/Omega/Alcaplast', 'Compatible con Sigma, Omega, AlcaPlast', 425.50),
    ('E10003', 'M1 para Delta', 'Compatible con Delta', 425.50),
    ('E10004', 'M1 para Tece', 'Compatible con Tece', 425.50),
    ('E10006', 'M2 para Sigma/Omega/Alcaplast', 'Compatible con Sigma, Omega, AlcaPlast', 425.50),
    ('E10007', 'M2 para Delta', 'Compatible con Delta', 425.50),
    ('E10008', 'M2 para Tece', 'Compatible con Tece', 425.50),
    ('E10024', 'M1 para OLI', 'Compatible con OLI', 425.50),
    ('E10025', 'M2 para OLI', 'Compatible con OLI', 425.50),
    ('E10028', 'M1 para Jomotech', 'Compatible con Jomotech', 425.50),
    ('E10029', 'M2 para Jomotech', 'Compatible con Jomotech', 425.50),
    ('E10009', 'M3 InvisiFlush GROHE Blanca', 'Compatible con GROHE Rapid SL', 402.50),
    ('E10010', 'M3 InvisiFlush GROHE Negra', 'Compatible con GROHE Rapid SL', 402.50),
]

# Productos SIN consumibles (ordenados por precio descendente)
sin_consumibles = [
    ('E10015', 'M1 Invisi Tile Touch Universal', '5 en 1: Sigma, Omega, AlcaPlast, Delta, Tece', 333.50),
    ('E10022', 'M2 Invisi Tile Touch Universal', '5 en 1: Sigma, Omega, AlcaPlast, Delta, Tece', 333.50),
    ('E10016', 'M1 para Sigma/Omega/Alcaplast', 'Compatible con Sigma, Omega, AlcaPlast', 310.50),
    ('E10017', 'M1 para Delta', 'Compatible con Delta', 310.50),
    ('E10018', 'M1 para Tece', 'Compatible con Tece', 310.50),
    ('E10019', 'M2 para Sigma/Omega/Alcaplast', 'Compatible con Sigma, Omega, AlcaPlast', 310.50),
    ('E10020', 'M2 para Delta', 'Compatible con Delta', 310.50),
    ('E10021', 'M2 para Tece', 'Compatible con Tece', 310.50),
    ('E10026', 'M1 para OLI', 'Compatible con OLI', 310.50),
    ('E10027', 'M2 para OLI', 'Compatible con OLI', 310.50),
    ('E10030', 'M1 para Jomotech', 'Compatible con Jomotech', 310.50),
    ('E10031', 'M2 para Jomotech', 'Compatible con Jomotech', 310.50),
    ('E10013', 'M3 InvisiFlush GROHE Blanca', 'Compatible con GROHE Rapid SL', 299.00),
    ('E10014', 'M3 InvisiFlush GROHE Negra', 'Compatible con GROHE Rapid SL', 299.00),
]

def generate_product_card(sku, title, compat, price, image_suffix=''):
    """Genera una tarjeta de producto"""
    carousel_id = f"carousel-{sku.lower()}"
    image_base = f"images/products/pulsador-{sku.lower()}"
    
    return f'''                <!-- {sku} -->
                <div class="product-card">
                    <div class="product-carousel" id="{carousel_id}">
                        <div class="carousel-track">
                            <div class="carousel-slide">
                                <img src="{image_base}.jpg" alt="{title}"
                                    class="product-image" onerror="this.src='images/products/M1%20with/m1real2.jpg'">
                            </div>
                            <div class="carousel-slide">
                                <img src="{image_base}.jpg" alt="{title}"
                                    class="product-image" onerror="this.src='images/products/M1%20with/m1real.jpg'">
                            </div>
                            <div class="carousel-slide">
                                <img src="{image_base}.jpg" alt="{title}"
                                    class="product-image" onerror="this.src='images/products/M1%20with/m1.jpg'">
                            </div>
                        </div>
                    </div>
                    <h4>Pulsador EDPLIT {title} <span
                            style="color: #b69776; font-size: 0.85em; font-weight: 500;">({sku})</span></h4>
                    <p class="product-desc">Pulsador oculto con consumibles</p>
                    <p class="product-compat">{compat}</p>
                    <p class="product-price"><strong style="font-size: 0.5em; font-weight: 700;">A partir</strong>
                        {price:,.2f} €</p>
                    <p class="vat-disclaimer">Precios sin IVA</p>
                </div>

'''

# Generar HTML completo
html_output = '''    <!-- CATALOG SECTION -->
    <section class="products-section" style="background: var(--bg-body);">
        <div class="container">
            <!-- PULSADORES CON CONSUMIBLES -->
            <div style="margin-bottom: 3rem;">
                <h2 style="text-align: center; margin-bottom: 2rem; color: var(--primary);">Pulsadores Ocultos CON Consumibles</h2>
                <div class="catalog-grid">
'''

for sku, title, compat, price in con_consumibles:
    html_output += generate_product_card(sku, title, compat, price)

html_output += '''                </div>
            </div>

            <!-- PULSADORES SIN CONSUMIBLES -->
            <div style="margin-bottom: 3rem;">
                <h2 style="text-align: center; margin-bottom: 2rem; color: var(--primary);">Pulsadores Ocultos SIN Consumibles</h2>
                <div class="catalog-grid">
'''

for sku, title, compat, price in sin_consumibles:
    html_output += generate_product_card(sku, title, compat, price)

html_output += '''                </div>
            </div>

            <div style="text-align: center; margin-top: 3rem;">
                <a href="index.html#contacto" class="btn btn-primary">Solicitar Presupuesto</a>
            </div>
        </div>
    </section>'''

# Guardar en archivo
with open('pulsadores_section.html', 'w', encoding='utf-8') as f:
    f.write(html_output)

print("✅ HTML generado en 'pulsadores_section.html'")
print(f"📊 Total productos: {len(con_consumibles) + len(sin_consumibles)}")
print(f"   • CON consumibles: {len(con_consumibles)}")
print(f"   • SIN consumibles: {len(sin_consumibles)}")
