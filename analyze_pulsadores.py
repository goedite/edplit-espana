#!/usr/bin/env python3
"""
Análisis completo de pulsadores E10xxx
"""

# Productos del CSV (E10001-E10031)
csv_pulsadores = {
    # CON CONSUMIBLES
    'E10001': ('M1 pulsador oculto Edplit Invisi Tile Touch, con consumibles (5 en 1 universal)', 448.50),
    'E10002': ('M1 pulsador oculto para Sigma/Omega/Alcaplast, con consumibles', 425.50),
    'E10003': ('M1 pulsador oculto para Delta, con consumibles', 425.50),
    'E10004': ('M1 pulsador oculto para Tece, con consumibles', 425.50),
    'E10005': ('M2 pulsador oculto Edplit Invisi Tile Touch, con consumibles (5 en 1 universal)', 448.50),
    'E10006': ('M2 pulsador oculto para Sigma/Omega/Alcaplast, con consumibles', 425.50),
    'E10007': ('M2 pulsador oculto para Delta, con consumibles', 425.50),
    'E10008': ('M2 pulsador oculto para Tece, con consumibles', 425.50),
    'E10009': ('M3 pulsador oculto Edplit InvisiFlush (GROHE) – blanca, con consumibles', 402.50),
    'E10010': ('M3 pulsador oculto Edplit InvisiFlush (GROHE) – negra, con consumibles', 402.50),
    'E10024': ('M1 pulsador oculto para OLI, con consumibles', 425.50),
    'E10025': ('M2 pulsador oculto para OLI, con consumibles', 425.50),
    'E10028': ('M1 pulsador oculto para Jomotech, con consumibles', 425.50),
    'E10029': ('M2 pulsador oculto para Jomotech, con consumibles', 425.50),
    
    # SIN CONSUMIBLES
    'E10013': ('M3 pulsador oculto Edplit InvisiFlush (GROHE) – blanca', 299.00),
    'E10014': ('M3 pulsador oculto Edplit InvisiFlush (GROHE) – negra', 299.00),
    'E10015': ('M1 pulsador oculto Edplit Invisi Tile Touch, sin consumibles (5 en 1 universal)', 333.50),
    'E10016': ('M1 pulsador oculto para Sigma/Omega/Alcaplast, sin consumibles', 310.50),
    'E10017': ('M1 pulsador oculto para Delta, sin consumibles', 310.50),
    'E10018': ('M1 pulsador oculto para Tece, sin consumibles', 310.50),
    'E10019': ('M2 pulsador oculto para Sigma/Omega/Alcaplast, sin consumibles', 310.50),
    'E10020': ('M2 pulsador oculto para Delta, sin consumibles', 310.50),
    'E10021': ('M2 pulsador oculto para Tece, sin consumibles', 310.50),
    'E10022': ('M2 pulsador oculto Edplit Invisi Tile Touch, sin consumibles (5 en 1 universal)', 333.50),
    'E10026': ('M1 pulsador oculto para OLI, sin consumibles', 310.50),
    'E10027': ('M2 pulsador oculto para OLI, sin consumibles', 310.50),
    'E10030': ('M1 pulsador oculto para Jomotech, sin consumibles', 310.50),
    'E10031': ('M2 pulsador oculto para Jomotech, sin consumibles', 310.50),
}

# Productos en la web actual (según grep anterior)
web_pulsadores = {
    'E10013', 'E10014', 'E10019', 'E10026'
}

print("=" * 80)
print("ANÁLISIS COMPLETO DE PULSADORES (E10001-E10031)")
print("=" * 80)
print()

print(f"📊 Total en CSV: {len(csv_pulsadores)} SKUs")
print(f"🌐 Total en WEB: {len(web_pulsadores)} SKUs")
print()

# Productos faltantes
faltantes = set(csv_pulsadores.keys()) - web_pulsadores

print("❌ PRODUCTOS FALTANTES EN LA WEB:")
print("=" * 80)
print()

# Separar por categoría
con_consumibles = []
sin_consumibles = []

for sku in sorted(faltantes):
    nombre, precio = csv_pulsadores[sku]
    if 'con consumibles' in nombre:
        con_consumibles.append((sku, nombre, precio))
    else:
        sin_consumibles.append((sku, nombre, precio))

print("🔸 CON CONSUMIBLES:")
print(f"   Total: {len(con_consumibles)} productos")
print()
for sku, nombre, precio in con_consumibles:
    print(f"   • {sku} - {nombre[:70]}... - {precio:.2f} €")

print()
print("🔸 SIN CONSUMIBLES:")
print(f"   Total: {len(sin_consumibles)} productos")
print()
for sku, nombre, precio in sin_consumibles:
    print(f"   • {sku} - {nombre[:70]}... - {precio:.2f} €")

print()
print("=" * 80)
print(f"TOTAL FALTANTES: {len(faltantes)} productos")
print("=" * 80)

# Mostrar los 3 más caros CON consumibles (para mostrar primero)
print()
print("💰 TOP 3 MÁS CAROS CON CONSUMIBLES (para mostrar primero):")
print("=" * 80)
top3 = sorted(con_consumibles, key=lambda x: x[2], reverse=True)[:3]
for i, (sku, nombre, precio) in enumerate(top3, 1):
    print(f"{i}. {sku} - {nombre[:60]}... - {precio:.2f} €")
