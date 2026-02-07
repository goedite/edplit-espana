#!/usr/bin/env python3
"""
Reemplazar la sección de productos en pulsadores.html
"""

# Leer el HTML generado
with open('pulsadores_section.html', 'r', encoding='utf-8') as f:
    new_section = f.read()

# Leer el archivo original
with open('pulsadores.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Encontrar las líneas de inicio y fin de la sección
# Inicio: línea 90 (<!-- CATALOG SECTION -->)
# Fin: línea 240 (</section>)

# Construir el nuevo archivo
new_content = []

# Añadir todo hasta la línea 89 (antes de CATALOG SECTION)
new_content.extend(lines[:89])

# Añadir la nueva sección
new_content.append(new_section)
if not new_section.endswith('\n'):
    new_content.append('\n')

# Añadir todo desde la línea 241 en adelante (después de </section>)
new_content.extend(lines[240:])

# Escribir el archivo actualizado
with open('pulsadores.html', 'w', encoding='utf-8') as f:
    f.writelines(new_content)

print("✅ Archivo pulsadores.html actualizado")
print(f"📊 Líneas originales: {len(lines)}")
print(f"📊 Líneas nuevas: {len(new_content)}")
print(f"📊 Diferencia: {len(new_content) - len(lines)} líneas")
