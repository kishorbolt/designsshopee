import json
import glob
import re

print("🔍 Validating JSON-LD Structured Data across all HTML files...")

# Validate index.html
with open('dist/index.html', 'r', encoding='utf-8') as f:
    content = f.read()
    blocks = re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', content, re.DOTALL)
    print(f'dist/index.html: Found {len(blocks)} JSON-LD blocks')
    for i, b in enumerate(blocks):
        data = json.loads(b.strip())
        print(f"  Block {i+1}: @type={data.get('@type')}, name={data.get('name')}")

# Validate product pages
product_files = sorted(glob.glob('dist/product/*/index.html'))
print(f"\nFound {len(product_files)} pre-rendered product detail pages:")
for pf in product_files:
    with open(pf, 'r', encoding='utf-8') as f:
        c = f.read()
        blocks = re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', c, re.DOTALL)
        p_ld = None
        for b in blocks:
            d = json.loads(b.strip())
            if d.get('@type') == 'Product':
                p_ld = d
        title = re.search(r'<title>(.*?)</title>', c).group(1)
        canonical = re.search(r'<link rel="canonical" href="(.*?)"', c).group(1)
        clean_path = pf.replace('\\', '/')
        print(f"{clean_path}:")
        print(f"  Title: {title}")
        print(f"  Canonical: {canonical}")
        print(f"  Product Name: {p_ld['name']} | Price: INR {p_ld['offers']['price']} | Images: {len(p_ld['image'])}")

# Validate about page
with open('dist/about/index.html', 'r', encoding='utf-8') as f:
    c = f.read()
    title = re.search(r'<title>(.*?)</title>', c).group(1)
    canonical = re.search(r'<link rel="canonical" href="(.*?)"', c).group(1)
    print(f"\ndist/about/index.html:")
    print(f"  Title: {title}")
    print(f"  Canonical: {canonical}")

print("\n🎉 ALL STRUCTURED DATA AND CANONICAL URLS VALIDATED SUCCESSFULLY!")
