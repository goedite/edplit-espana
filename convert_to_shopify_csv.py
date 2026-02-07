#!/usr/bin/env python3
"""
Conversor de CSV EDPLIT a formato Shopify (Arquitectura B2B + Stock Mixto)
Actualizado: 2026-02-04
"""

import csv
import os
from datetime import datetime

# Mapeo de categorías
CATEGORY_MAP = {
    'E10': 'Pulsadores Ocultos',
    'E20': 'Tapas de Registro',
    'E30': 'Ventiladores',
    'E40': 'Enchufes e Interruptores',
    'E50': 'Tapas de Registro',
    'E60': 'Toalleros Ocultos'
}

# Mapeo de compatibilidad
COMPATIBILITY_MAP = {
    'Sigma': 'geberit,sigma',
    'Omega': 'geberit,omega',
    'Alcaplast': 'alcaplast',
    'AlcaPlast': 'alcaplast',
    'Delta': 'delta',
    'Tece': 'tece',
    'TECE': 'tece',
    'OLI': 'oli',
    'Jomotech': 'jomotech',
    'Viega': 'viega',
    'VitrA': 'vitra',
    'Noken': 'noken',
    'Cersanit': 'cersanit',
    'GROHE': 'grohe'
}

def extract_tags(description, sku):
    """Extrae tags de la descripción del producto y SKU"""
    tags = []
    
    # Detectar compatibilidad
    for brand, tag in COMPATIBILITY_MAP.items():
        if brand in description:
            tags.extend(tag.split(','))
    
    # Lógica de Logística (Stock Mixto)
    # Por defecto, M3, M4 y toalleros grandes suelen ser Bajo Pedido
    is_bajo_pedido = any(x in description for x in ['M3', 'M4', '5 uds'])
    if is_bajo_pedido:
        tags.append('BAJO_PEDIDO')
    else:
        tags.append('STOCK_ES')
    
    # Detectar consumibles
    if 'con consumibles' in description.lower():
        tags.append('con-consumibles')
    elif 'sin consumibles' in description.lower():
        tags.append('sin-consumibles')
    
    # Detectar modelo
    for m in ['M1', 'M2', 'M3', 'M4']:
        if m in description:
            tags.append(m.lower())
    
    if 'Universal' in description or '5 en 1' in description:
        tags.append('universal')
    if 'oculto' in description.lower():
        tags.append('oculto')
        
    return list(set(tags))

def get_product_type(sku):
    prefix = sku[:3]
    return CATEGORY_MAP.get(prefix, 'Otros')

def get_delivery_message(tags):
    # Mensaje genérico ya que el plazo depende del stock real en Gandía
    return 'Plazo de entrega: 24-48h si hay stock | 8-15 días si requiere reposición'

def convert_to_shopify_csv(input_file, output_file):
    shopify_products = []
    
    # Abrir con utf-8-sig para manejar el BOM (\ufeff)
    with open(input_file, 'r', encoding='utf-8-sig') as f:
        # Leer primera línea para detectar delimitador
        header_sample = f.readline()
        delimiter = ';' if ';' in header_sample else ','
        f.seek(0)
        
        reader = csv.DictReader(f, delimiter=delimiter)
        
        for row in reader:
            # Obtener campos con nombres posibles
            sku = (row.get('Código (SKU)') or row.get('SKU') or '').strip()
            description = (row.get('Producto') or row.get('Descripción') or '').strip()
            price = (row.get('PVP (€)') or row.get('Precio') or '0').strip().replace(',', '.')
            
            if not sku or not description:
                continue
            
            product_type = get_product_type(sku)
            tags = extract_tags(description, sku)
            delivery_msg = get_delivery_message(tags)
            
            # MODELO REAL: Todos los productos permiten backorder
            # Stock inicial en 0 - se actualizará manualmente en Shopify según lleguen remesas
            inv_policy = 'continue'  # Siempre permitir venta (backorder)
            inv_qty = '0'  # Stock inicial 0 - actualizar manualmente en Shopify
            
            title = description.split('(')[0].strip() if '(' in description else description
            handle = sku.lower().replace('/', '-')
            
            body_html = f"""<div class="product-description">
<p class="delivery-badge" style="background:#f4f4f4; padding:8px; border-radius:4px; font-weight:bold; color:#b8956e;">
    🚚 {delivery_msg}
</p>

<h3>Descripción</h3>
<p>{description}</p>

<h3>Especificaciones Técnicas</h3>
<ul>
    <li><strong>SKU:</strong> {sku}</li>
    <li><strong>Categoría:</strong> {product_type}</li>
    <li><strong>Montaje:</strong> Sistema oculto sin marco visible.</li>
</ul>

<h3>Servicios para Profesionales B2B</h3>
<p>Si eres arquitecto, interioristas o instalador, solicita tu cuenta profesional para acceder a tarifas especiales y soporte técnico prioritario en <a href="mailto:info@edplit.es">info@edplit.es</a>.</p>
</div>"""
            
            shopify_product = {
                'Handle': handle,
                'Title': title,
                'Body (HTML)': body_html,
                'Vendor': 'EDPLIT España',
                'Type': product_type,
                'Tags': ','.join(tags),
                'Published': 'TRUE',
                'Option1 Name': 'Title',
                'Option1 Value': 'Default Title',
                'Variant SKU': sku,
                'Variant Grams': '800',
                'Variant Inventory Tracker': 'shopify',
                'Variant Inventory Qty': inv_qty,
                'Variant Inventory Policy': inv_policy,
                'Variant Fulfillment Service': 'manual',
                'Variant Price': price,
                'Variant Requires Shipping': 'TRUE',
                'Variant Taxable': 'TRUE',
                'Image Src': f'https://edplit.es/images/products/{sku.lower().replace("/","-")}.jpg',
                'Image Position': '1',
                'SEO Title': f'{title} | Soluciones Ocultas EDPLIT',
                'SEO Description': f'{description}. {delivery_msg}. Alta calidad para baños minimalistas.',
                'Status': 'active'
            }
            
            shopify_products.append(shopify_product)

    if shopify_products:
        fieldnames = shopify_products[0].keys()
        with open(output_file, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(shopify_products)
        print(f"✅ CSV generado satisfactoriamente: {output_file} ({len(shopify_products)} productos)")
    else:
        print("❌ Error: No se ha podido extraer ningún producto del CSV de entrada.")

if __name__ == '__main__':
    input_file = 'precios web  febrero 2026 CSV.csv'
    output_file = f'shopify_products_B2B_{datetime.now().strftime("%Y%m%d")}.csv'
    
    if os.path.exists(input_file):
        convert_to_shopify_csv(input_file, output_file)
    else:
        print(f"❌ Error: No se encuentra {input_file}")
