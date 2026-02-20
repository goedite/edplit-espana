import os
import re

seo_data_extra = {
    "tienda.html": {
        "url": "https://edplit.es/tienda.html",
        "title": "Tienda Online de Instalaciones Ocultas y Minimalistas | EDPLIT España",
        "description": "Compra productos EDPLIT en España. Pulsadores ocultos, enchufes invisibles, ventiladores y más. Envío 24-48h.",
        "image": "https://edplit.es/images/hero/hero-main%202.jpg"
    },
    "privacidad.html": {
        "url": "https://edplit.es/privacidad.html",
        "title": "Política de Privacidad - EDPLIT España",
        "description": "Política de privacidad y protección de datos de EDPLIT España.",
        "image": "https://edplit.es/images/hero/hero-main%202.jpg"
    },
    "aviso-legal.html": {
        "url": "https://edplit.es/aviso-legal.html",
        "title": "Aviso Legal - EDPLIT España",
        "description": "Aviso legal general y términos de uso de la página web de EDPLIT España.",
        "image": "https://edplit.es/images/hero/hero-main%202.jpg"
    },
    "cookies.html": {
        "url": "https://edplit.es/cookies.html",
        "title": "Política de Cookies - EDPLIT España",
        "description": "Política de cookies de EDPLIT España. Información sobre el uso de cookies en nuestra web.",
        "image": "https://edplit.es/images/hero/hero-main%202.jpg"
    }
}

for file, data in seo_data_extra.items():
    if not os.path.exists(file):
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Update Title
    content = re.sub(r'<title>.*?</title>', f'<title>{data["title"]}</title>', content, flags=re.IGNORECASE)
    
    # Check if OG exists
    if '<meta property="og:url"' in content or '<link rel="canonical"' in content:
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
    
    content = content.replace('</title>', f'</title>\n{og_snippet}')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Extra pages SEO tags updated!")
