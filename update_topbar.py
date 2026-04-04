import glob

html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the items
    content = content.replace('<div class=\"top-bar-item\">✓ Envío gratis desde 490 €</div>', '<div class=\"top-bar-item\"><span class=\"tb-icon\">✦</span> Envío gratis desde 490 €</div>')
    content = content.replace('<div class=\"top-bar-item\">✓ 10 años de garantía</div>', '<div class=\"top-bar-item\"><span class=\"tb-icon\">✦</span> 10 años de garantía</div>')
    content = content.replace('<div class=\"top-bar-item\">✓ Distribuidor oficial en España</div>', '<div class=\"top-bar-item\"><span class=\"tb-icon\">✦</span> Distribuidor oficial en España</div>')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print("done")
