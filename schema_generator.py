import os
import re
import json

base_url = "https://edplit.es"

def get_products(html_content, page_url):
    products = []
    # Find all product cards
    cards = re.findall(r'<div class="product-card">(.*?)<a href="([^"]+)"', html_content, re.DOTALL)
    for index, (card_html, link) in enumerate(cards):
        # Image
        img_match = re.search(r'<img src="([^"]+)"', card_html)
        image = f"{base_url}/{img_match.group(1)}" if img_match else ""
        
        # Name and SKU
        h4_match = re.search(r'<h4[^>]*>(.*?)<span.*?>(.*?)</span></h4>', card_html, re.DOTALL)
        if h4_match:
            name = h4_match.group(1).strip()
            sku = h4_match.group(2).replace('(', '').replace(')', '').strip()
        else:
            name_fallback = re.search(r'<h4[^>]*>(.*?)</h4>', card_html, re.DOTALL)
            name = name_fallback.group(1).strip() if name_fallback else "Producto EDPLIT"
            sku = "SKU-UNDEFINED"
            
        # Description
        desc_match = re.search(r'<p class="product-desc">(.*?)</p>', card_html)
        description = desc_match.group(1).strip() if desc_match else "Producto EDPLIT"
        
        # Price
        price_match = re.search(r'A partir(?:</strong>)?\s*([\d,.]+)\s*€', card_html)
        if price_match:
            price_str = price_match.group(1).replace('.', '').replace(',', '.')
            try:
                price = float(price_str)
            except:
                price = 0.0
        else:
            price = 0.0
            
        # Ensure full link
        if not link.startswith("http"):
             link = f"{base_url}/{link}"
             
        if price > 0:
            offer = {
                "@type": "Offer",
                "url": link,
                "priceCurrency": "EUR",
                "price": str(price),
                "availability": "https://schema.org/InStock",
                "seller": {
                    "@type": "Organization",
                    "name": "EDPLIT España"
                }
            }
        else:
            offer = {
                "@type": "Offer",
                "url": link,
                "availability": "https://schema.org/InStock"
            }
            
        products.append({
            "@type": "Product",
            "name": name,
            "image": image,
            "description": description,
            "sku": sku,
            "offers": offer
        })
    return products

def inject_schema(file_path, url_path):
    if not os.path.exists(file_path):
        return
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if "application/ld+json" in content:
        print(f"Schema already in {file_path}")
        return
        
    schemas = []
    
    # Base Organization for all pages
    org_schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "EDPLIT España",
      "url": "https://edplit.es/",
      "logo": "https://edplit.es/images/logo/logo.png"
    }
    schemas.append(org_schema)
    
    products = get_products(content, f"{base_url}/{url_path}")
    if products:
        item_list_schema = {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": []
        }
        for i, prod in enumerate(products):
            item_list_schema["itemListElement"].append({
                "@type": "ListItem",
                "position": i + 1,
                "item": prod
            })
        schemas.append(item_list_schema)

    schema_tags = ""
    for s in schemas:
        schema_tags += f'\n    <script type="application/ld+json">\n{json.dumps(s, ensure_ascii=False, indent=4)}\n    </script>'
        
    # Inject before </head>
    content = content.replace('</head>', f'{schema_tags}\n</head>')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

files = ["index.html", "pulsadores.html", "enchufes.html", "ventiladores.html", "tapas.html", "toalleros.html", "tienda.html", "privacidad.html", "aviso-legal.html", "cookies.html"]
for file in files:
    inject_schema(file, file)
print("Schema injected successfully")
