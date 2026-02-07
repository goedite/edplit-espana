#!/usr/bin/env python3
"""
Script para añadir botones 'Ver en tienda' a todas las tarjetas de producto
en las páginas de catálogo (pulsadores, enchufes, ventiladores, tapas, toalleros)
"""

import re
from pathlib import Path

# Páginas a modificar
PAGES = [
    'pulsadores.html',
    'enchufes.html',
    'ventiladores.html',
    'tapas.html',
    'toalleros.html'
]

# Patrón para encontrar el cierre de product-card justo después del vat-disclaimer
PATTERN = r'(<p class="vat-disclaimer">Precios sin IVA</p>\s*)(</div>\s*(?:</div>)?\s*(?:<div class="product-card"|</div>\s*</div>|$))'

# Botón a insertar
BUTTON_HTML = '''<a href="tienda.html" class="btn btn-primary" style="margin-top: 1rem; width: 100%; font-size: 0.9rem;">Ver en tienda →</a>
                    '''

def add_store_buttons(filepath):
    """Añade botones 'Ver en tienda' a un archivo HTML"""
    print(f"\n📄 Procesando {filepath.name}...")
    
    # Leer contenido
    content = filepath.read_text(encoding='utf-8')
    
    # Contar cuántas veces aparece el patrón
    matches = list(re.finditer(PATTERN, content))
    print(f"   Encontradas {len(matches)} tarjetas de producto")
    
    if len(matches) == 0:
        print("   ⚠️  No se encontraron tarjetas para modificar")
        return False
    
    # Reemplazar: insertar botón antes del cierre del div
    def replacement(match):
        return match.group(1) + BUTTON_HTML + match.group(2)
    
    new_content = re.sub(PATTERN, replacement, content)
    
    # Verificar que se hicieron cambios
    if new_content == content:
        print("   ⚠️  No se realizaron cambios")
        return False
    
    # Guardar
    filepath.write_text(new_content, encoding='utf-8')
    print(f"   ✅ Añadidos {len(matches)} botones 'Ver en tienda'")
    return True

def main():
    """Procesar todas las páginas"""
    print("🚀 Añadiendo botones 'Ver en tienda' a páginas de catálogo...")
    
    base_dir = Path(__file__).parent
    modified_count = 0
    
    for page in PAGES:
        filepath = base_dir / page
        if not filepath.exists():
            print(f"\n⚠️  {page} no encontrado, saltando...")
            continue
        
        if add_store_buttons(filepath):
            modified_count += 1
    
    print(f"\n✨ Completado: {modified_count}/{len(PAGES)} archivos modificados")

if __name__ == '__main__':
    main()
