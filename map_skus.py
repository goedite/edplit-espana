import csv

products = {}

csv_file = 'shopify_products_B2B_20260204.csv'

try:
    with open(csv_file, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            sku = row.get('Variant SKU', '').strip()
            handle = row.get('Handle', '').strip()
            
            # Skip rows without SKU or Handle
            if not sku or not handle:
                continue

            # Handle multiple SKUs if separated by slash (e.g., E40013/E40014/E40015)
            skus = sku.split('/')
            for s in skus:
                s = s.strip()
                if s:
                    products[s] = f"https://tienda.edplit.es/products/{handle}"

    # Print the mapping nicely
    print("SKU -> Shopify URL Mapping:")
    for sku, url in sorted(products.items()):
        print(f"{sku}: {url}")

except Exception as e:
    print(f"Error reading CSV: {e}")
