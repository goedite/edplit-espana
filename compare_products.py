#!/usr/bin/env python3
"""
Script para comparar productos del CSV con los que están en la web
"""

import re
from pathlib import Path

# Leer el CSV
csv_file = Path("precios web  febrero 2026 CSV.csv")
with open(csv_file, 'r', encoding='utf-8') as f:
    csv_lines = f.readlines()

# Extraer todos los SKUs del CSV
csv_skus = set()
csv_products = {}
for line in csv_lines[1:]:  # Skip header
    if line.strip():
        parts = line.strip().split(',')
        if len(parts) >= 2:
            sku = parts[1].strip()
            product_name = parts[0].strip()
            if sku.startswith('E'):
                csv_skus.add(sku)
                csv_products[sku] = product_name

# Buscar SKUs en archivos HTML
html_files = [
    'index.html',
    'pulsadores.html',
    'enchufes.html',
    'ventiladores.html',
    'tapas.html',
    'toalleros.html'
]

web_skus = set()
for html_file in html_files:
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
            # Buscar patrones como (E10001), (E20002), etc.
            matches = re.findall(r'\(E\d{5}\)', content)
            for match in matches:
                sku = match.strip('()')
                web_skus.add(sku)
    except FileNotFoundError:
        pass

# Comparar
missing_skus = csv_skus - web_skus
extra_skus = web_skus - csv_skus

print("=" * 80)
print("ANÁLISIS DE PRODUCTOS - CSV vs WEB")
print("=" * 80)
print()

print(f"📊 Total productos en CSV: {len(csv_skus)}")
print(f"🌐 Total productos en WEB: {len(web_skus)}")
print()

if missing_skus:
    print("❌ PRODUCTOS QUE FALTAN EN LA WEB:")
    print("=" * 80)
    
    # Agrupar por categoría
    categories = {
        'E10': 'PULSADORES',
        'E20': 'TAPAS/TRAMPILLAS',
        'E30': 'VENTILADORES',
        'E40': 'ENCHUFES/INTERRUPTORES',
        'E60': 'TOALLEROS'
    }
    
    for prefix, category in categories.items():
        category_skus = sorted([sku for sku in missing_skus if sku.startswith(prefix)])
        if category_skus:
            print(f"\n🔸 {category}:")
            for sku in category_skus:
                product_name = csv_products.get(sku, 'Nombre no encontrado')
                # Truncar nombre si es muy largo
                if len(product_name) > 70:
                    product_name = product_name[:67] + '...'
                print(f"   • {sku} - {product_name}")
    
    print()
    print(f"Total productos faltantes: {len(missing_skus)}")
else:
    print("✅ ¡Todos los productos del CSV están en la web!")

if extra_skus:
    print()
    print("⚠️  PRODUCTOS EN LA WEB QUE NO ESTÁN EN EL CSV:")
    print("=" * 80)
    for sku in sorted(extra_skus):
        print(f"   • {sku}")

print()
print("=" * 80)
