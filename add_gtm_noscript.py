#!/usr/bin/env python3
"""
Script para añadir el noscript de Google Tag Manager en todas las páginas HTML
"""

import re
from pathlib import Path

# Páginas a modificar (todas las HTML principales)
PAGES = [
    'index.html',
    'pulsadores.html',
    'enchufes.html',
    'ventiladores.html',
    'tapas.html',
    'toalleros.html',
    'tienda.html',
    'privacidad.html',
    'cookies.html',
    'aviso-legal.html',
    'presupuestos.html'
]

# Noscript a insertar justo después de <body>
GTM_NOSCRIPT = '''<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5JX4R3CN"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
'''

def add_gtm_noscript(filepath):
    """Añade el noscript de GTM después de la etiqueta <body>"""
    print(f"\n📄 Procesando {filepath.name}...")
    
    # Leer contenido
    content = filepath.read_text(encoding='utf-8')
    
    # Verificar si ya tiene el noscript de GTM
    if 'GTM-5JX4R3CN' in content and 'noscript' in content:
        print(f"   ⚠️  Ya tiene GTM noscript, saltando...")
        return False
    
    # Buscar la etiqueta <body> y añadir el noscript justo después
    # Patrón: <body> o <body con atributos>
    pattern = r'(<body[^>]*>)'
    
    if not re.search(pattern, content, re.IGNORECASE):
        print(f"   ⚠️  No se encontró etiqueta <body>, saltando...")
        return False
    
    # Insertar noscript después de <body>
    new_content = re.sub(
        pattern,
        r'\1\n    ' + GTM_NOSCRIPT,
        content,
        count=1,
        flags=re.IGNORECASE
    )
    
    # Verificar que se hizo el cambio
    if new_content == content:
        print(f"   ⚠️  No se realizaron cambios")
        return False
    
    # Guardar
    filepath.write_text(new_content, encoding='utf-8')
    print(f"   ✅ GTM noscript añadido")
    return True

def main():
    """Procesar todas las páginas"""
    print("🚀 Añadiendo GTM noscript a páginas HTML...")
    
    base_dir = Path(__file__).parent
    modified_count = 0
    
    for page in PAGES:
        filepath = base_dir / page
        if not filepath.exists():
            print(f"\n⚠️  {page} no encontrado, saltando...")
            continue
        
        if add_gtm_noscript(filepath):
            modified_count += 1
    
    print(f"\n✨ Completado: {modified_count}/{len(PAGES)} archivos modificados")

if __name__ == '__main__':
    main()
