import os
import re
import json
import hashlib
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRODUCTS_DIR = os.path.join(BASE_DIR, 'public', 'products')
THUMBS_DIR = os.path.join(PRODUCTS_DIR, 'thumbs')
OVERRIDES_FILE = os.path.join(BASE_DIR, 'src', 'data', 'product-overrides.json')
OUTPUT_SRC_FILE = os.path.join(BASE_DIR, 'src', 'data', 'products.json')
OUTPUT_CATEGORIES_FILE = os.path.join(BASE_DIR, 'src', 'data', 'categories.json')
OUTPUT_PUBLIC_FILE = os.path.join(BASE_DIR, 'public', 'data', 'products.json')

os.makedirs(THUMBS_DIR, exist_ok=True)
os.makedirs(os.path.dirname(OUTPUT_SRC_FILE), exist_ok=True)
os.makedirs(os.path.dirname(OUTPUT_PUBLIC_FILE), exist_ok=True)

# Load existing overrides if present
overrides = {}
if os.path.exists(OVERRIDES_FILE):
    try:
        with open(OVERRIDES_FILE, 'r', encoding='utf-8') as f:
            overrides = json.load(f)
    except Exception as e:
        print(f"Warning: could not read overrides file: {e}")

valid_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.avif'}

# 1. Discover all images recursively
discovered = []
for root, dirs, files in os.walk(PRODUCTS_DIR):
    # Skip thumbs directory
    if os.path.abspath(root).startswith(os.path.abspath(THUMBS_DIR)):
        continue
    
    for f in sorted(files):
        ext = os.path.splitext(f)[1].lower()
        if ext in valid_extensions:
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, PRODUCTS_DIR).replace('\\', '/')
            parts = rel_path.split('/')
            
            # Determine category from folder structure
            if len(parts) > 1:
                category = parts[0]
            else:
                category = 'General Collection'
                
            discovered.append({
                'full_path': full_path,
                'rel_path': rel_path,
                'filename': f,
                'category': category,
                'ext': ext
            })

print(f"Discovered {len(discovered)} product images.")

def generate_stable_id(rel_path):
    h = hashlib.md5(rel_path.encode('utf-8')).hexdigest()[:8]
    return f"ds-{h}"

def clean_filename_to_title(filename, category, index):
    base = os.path.splitext(filename)[0]
    # Check if WhatsApp image pattern
    if 'whatsapp image' in base.lower():
        cat_short = category.replace('&', '').replace(' ', ' ').strip()
        return f"{cat_short} Edition #{index:02d}"
    
    # Generic cleaning for descriptive names
    clean = re.sub(r'[-_]+', ' ', base)
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean.title()

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

products = []
category_stats = {}

# Group by category to number nicely
cat_counters = {}

for idx, item in enumerate(discovered):
    cat = item['category']
    cat_counters[cat] = cat_counters.get(cat, 0) + 1
    cat_idx = cat_counters[cat]
    
    stable_id = generate_stable_id(item['rel_path'])
    
    # Check dimensions and generate thumbnail
    try:
        with Image.open(item['full_path']) as im:
            orig_w, orig_h = im.size
            aspect_ratio = round(orig_w / orig_h, 4)
            
            # WebP thumbnail
            thumb_rel = f"thumbs/{stable_id}.webp"
            thumb_full = os.path.join(THUMBS_DIR, f"{stable_id}.webp")
            
            if not os.path.exists(thumb_full):
                # Copy and resize
                thumb_im = im.copy()
                # Max dimension 600
                thumb_im.thumbnail((600, 600), Image.Resampling.LANCZOS)
                # Convert RGBA/RGB
                if thumb_im.mode in ('RGBA', 'LA') or (thumb_im.mode == 'P' and 'transparency' in thumb_im.info):
                    thumb_im = thumb_im.convert('RGBA')
                else:
                    thumb_im = thumb_im.convert('RGB')
                thumb_im.save(thumb_full, 'WEBP', quality=84, method=4)
    except Exception as e:
        print(f"Error processing image {item['full_path']}: {e}")
        orig_w, orig_h = 800, 800
        aspect_ratio = 1.0
        thumb_rel = f"products/{item['rel_path']}"
    
    # Check overrides
    override = overrides.get(stable_id) or overrides.get(item['filename']) or {}
    
    default_name = clean_filename_to_title(item['filename'], cat, cat_idx)
    name = override.get('name', default_name)
    slug = override.get('slug', slugify(f"{name}-{stable_id}"))
    price = override.get('price', None)  # Never invent price
    
    # Description
    default_desc = f"Exclusive {cat} item curated at DESIGNS SHOPEE, Vellore. Available for direct enquiry and immediate in-store pickup or local delivery."
    description = override.get('description', default_desc)
    
    # Featured & New Arrival flags
    # We mark top items in each category as featured & new arrival
    is_featured = override.get('featured', (cat_idx <= 3))
    is_new = override.get('newArrival', (cat_idx >= (cat_counters[cat] - 3) or cat_idx <= 2))
    
    product = {
        "id": stable_id,
        "name": name,
        "slug": slug,
        "category": override.get('category', cat),
        "image": f"/products/{item['rel_path']}",
        "thumbnail": f"/products/{thumb_rel}",
        "width": orig_w,
        "height": orig_h,
        "aspectRatio": aspect_ratio,
        "price": price,
        "priceDisplay": f"₹{price}" if price is not None else "Price on Request",
        "hasPrice": price is not None,
        "description": description,
        "availability": "Available for Enquiry",
        "inStock": True,
        "featured": is_featured,
        "newArrival": is_new,
        "originalFilename": item['filename']
    }
    
    products.append(product)
    
    # Update category stats
    c_name = product['category']
    if c_name not in category_stats:
        category_stats[c_name] = {
            "name": c_name,
            "slug": slugify(c_name),
            "count": 0,
            "image": product['thumbnail'],
            "featuredProductId": product['id']
        }
    category_stats[c_name]['count'] += 1

categories_list = list(category_stats.values())

# Write products.json
with open(OUTPUT_SRC_FILE, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

with open(OUTPUT_PUBLIC_FILE, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

with open(OUTPUT_CATEGORIES_FILE, 'w', encoding='utf-8') as f:
    json.dump(categories_list, f, indent=2, ensure_ascii=False)

# Generate sitemap.xml
SITEMAP_FILE = os.path.join(BASE_DIR, 'public', 'sitemap.xml')
sitemap_entries = [
    '<url><loc>https://designsshopee.in/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>',
    '<url><loc>https://designsshopee.in/shop</loc><changefreq>daily</changefreq><priority>0.9</priority></url>',
    '<url><loc>https://designsshopee.in/categories</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>',
    '<url><loc>https://designsshopee.in/about</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>',
    '<url><loc>https://designsshopee.in/contact</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>',
]

for p in products:
    sitemap_entries.append(
        f'<url><loc>https://designsshopee.in/product/{p["slug"]}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>'
    )

sitemap_xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(sitemap_entries)}
</urlset>
'''

with open(SITEMAP_FILE, 'w', encoding='utf-8') as f:
    f.write(sitemap_xml)

print(f"Generated sitemap.xml with {len(sitemap_entries)} URLs.")

# Write template product-overrides.json if not existing
if not os.path.exists(OVERRIDES_FILE):
    # Provide a starter sample override file with documentation
    sample_overrides = {
        "_comment": "Add custom metadata here by product ID or originalFilename. Custom edits are preserved during product discovery builds.",
        products[0]['id']: {
            "name": f"DESIGNS SHOPEE Signature {products[0]['category']} Item",
            "featured": True
        }
    }
    with open(OVERRIDES_FILE, 'w', encoding='utf-8') as f:
        json.dump(sample_overrides, f, indent=2)

print(f"Successfully generated catalog with {len(products)} products across {len(categories_list)} categories.")
print("Categories summary:")
for c in categories_list:
    print(f"  - {c['name']} ({c['count']} items)")
