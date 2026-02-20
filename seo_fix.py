import os
import re

seo_data = {
    "index.html": {
        "url": "https://edplit.es/",
        "title": "EDPLIT España — La elegancia invisible del diseño moderno",
        "description": "Edplit España — Soluciones de montaje oculto para baños minimalistas. Pulsadores de cisterna ocultos compatibles con Geberit, TECE y Grohe.",
        "image": "https://edplit.es/images/hero/hero-main%202.jpg"
    },
    "pulsadores.html": {
        "url": "https://edplit.es/pulsadores.html",
        "title": "Pulsadores Ocultos - EDPLIT España",
        "description": "Pulsadores ocultos para cisternas empotradas. Compatibles con Geberit, TECE, Grohe y más.",
        "image": "https://edplit.es/images/products/pulsador-e10001.jpg"
    },
    "enchufes.html": {
        "url": "https://edplit.es/enchufes.html",
        "title": "Enchufes e Interruptores Invisibles - EDPLIT España",
        "description": "Mecanismos de enchufe e interruptores invisibles EDPLIT. La solución perfecta para mantener la pureza de tus paredes.",
        "image": "https://edplit.es/images/products/marco-simple.png"
    },
    "ventiladores.html": {
        "url": "https://edplit.es/ventiladores.html",
        "title": "Ventiladores Ocultos - EDPLIT España",
        "description": "Ventiladores ocultos para baños. Sistemas de extracción invisibles StealthFlow 100, 125 y 150.",
        "image": "https://edplit.es/images/products/stealthflow-100.jpg"
    },
    "tapas.html": {
        "url": "https://edplit.es/tapas.html",
        "title": "Tapas de Registro - EDPLIT España",
        "description": "Tapas de registro ocultas TileFusion. Sistema magnético sin marcos visibles para acceso discreto.",
        "image": "https://edplit.es/images/products/tilefusion-m.jpg"
    },
    "toalleros.html": {
        "url": "https://edplit.es/toalleros.html",
        "title": "Toalleros Ocultos - EDPLIT España",
        "description": "Toalleros Ocultos con montaje invisible. Diseño minimalista en acero inoxidable premium.",
        "image": "https://edplit.es/images/products/hidden-bar-60.jpg"
    }
}

for file, data in seo_data.items():
    if not os.path.exists(file):
        print(f"File {file} not found.")
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # In enchufes.html, we must fix title and description first because they are wrong
    if file == "enchufes.html":
        # Replace the incorrectly copied description
        content = re.sub(r'<meta name="description"\s+content="Pulsadores ocultos para cisternas empotradas\. Compatibles con Geberit, TECE, Grohe y más\.">', 
                         f'<meta name="description"\n        content="{data["description"]}">', content)
        # Replace the incorrectly copied title
        content = re.sub(r'<title>Pulsadores Ocultos - EDPLIT España</title>', 
                         f'<title>{data["title"]}</title>', content)
    
    # Check if we already have OG tags to avoid duplicate blocks, just in case
    if '<meta property="og:url"' in content or '<link rel="canonical"' in content:
        print(f"File {file} seems to already have metadata/canonical.")
        # But we must save the title/desc changes for enchufes!
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        continue
    
    # Build OG tags and Canonical
    og_snippet = f"""    <link rel="canonical" href="{data["url"]}">
    <meta property="og:title" content="{data["title"]}">
    <meta property="og:description" content="{data["description"]}">
    <meta property="og:image" content="{data["image"]}">
    <meta property="og:url" content="{data["url"]}">
    <meta property="og:type" content="website">"""
    
    # Inject after <title>...</title>.
    # <title> has varying content depending on the file, so find </title>
    content = content.replace('</title>', f'</title>\n{og_snippet}')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("SEO tags successfully added!")
