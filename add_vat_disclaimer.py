import re

files = ['index.html', 'pulsadores.html', 'ventiladores.html', 'enchufes.html', 'tapas.html', 'toalleros.html']

for filename in files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to match product-price paragraphs
    pattern = r'(<p class="product-price">.*?€</p>)'
    replacement = r'\1\n                        <p class="vat-disclaimer">Precios sin IVA</p>'
    
    # Replace all occurrences
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    # Write back
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Updated {filename}")

print("All files updated with VAT disclaimer!")
