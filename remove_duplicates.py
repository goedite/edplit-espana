import re

files = ['index.html', 'pulsadores.html', 'ventiladores.html', 'enchufes.html', 'tapas.html', 'toalleros.html']

for filename in files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove duplicate VAT disclaimers (keep only one)
    pattern = r'(<p class="vat-disclaimer">Precios sin IVA</p>\s*)+<p class="vat-disclaimer">Precios sin IVA</p>'
    replacement = r'<p class="vat-disclaimer">Precios sin IVA</p>'
    
    # Replace all duplicate occurrences
    new_content = re.sub(pattern, replacement, content, flags=re.MULTILINE)
    
    # Write back
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Cleaned duplicates in {filename}")

print("All duplicates removed!")
