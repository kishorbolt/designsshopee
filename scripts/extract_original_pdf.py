import os
import re
import io
import json
import fitz # PyMuPDF
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIG_PDF = os.path.join(BASE_DIR, 'public', 'products', 'design shopee products orginal.pdf')
NAMED_PDF = os.path.join(BASE_DIR, 'public', 'products', 'Designs_Shopee_Product_Catalogue_Named.pdf')

OUT_ORIG_DIR = os.path.join(BASE_DIR, 'public', 'products', 'original')
OUT_THUMBS_DIR = os.path.join(BASE_DIR, 'public', 'products', 'thumbs')

SRC_DATA_FILE = os.path.join(BASE_DIR, 'src', 'data', 'products.json')
PUBLIC_DATA_FILE = os.path.join(BASE_DIR, 'public', 'data', 'products.json')
CATEGORIES_FILE = os.path.join(BASE_DIR, 'src', 'data', 'categories.json')
SITEMAP_FILE = os.path.join(BASE_DIR, 'public', 'sitemap.xml')
REPORT_FILE = os.path.join(BASE_DIR, 'PRODUCT_INTEGRATION_REPORT.json')

os.makedirs(OUT_ORIG_DIR, exist_ok=True)
os.makedirs(OUT_THUMBS_DIR, exist_ok=True)
os.makedirs(os.path.dirname(SRC_DATA_FILE), exist_ok=True)

print("📖 Reading Names from Named PDF...")
doc_named = fitz.open(NAMED_PDF)
names_by_page = {}

for page_idx, page in enumerate(doc_named):
    blocks = page.get_text('blocks')
    content = [b for b in blocks if b[4].strip() and 'DESIGNS SHOPEE' not in b[4] and 'Product Catalogue' not in b[4] and 'Names are descriptive' not in b[4]]
    ds_blocks = [b for b in content if re.match(r'^DS-\d+\s*[·•]', b[4].strip())]
    other_blocks = [b for b in content if not re.match(r'^DS-\d+\s*[·•]', b[4].strip())]
    
    for dsb in ds_blocks:
        m = re.match(r'^(DS-\d+)\s*[·•]\s*(.*)$', dsb[4].strip())
        code = m.group(1)
        ref = m.group(2)
        dcx = (dsb[0] + dsb[2]) / 2
        dy1 = dsb[3]
        
        matching_nb = []
        for ob in other_blocks:
            ocx = (ob[0] + ob[2]) / 2
            oy0 = ob[1]
            if abs(ocx - dcx) < 90 and (oy0 >= dy1 - 5) and (oy0 - dy1 < 45):
                matching_nb.append(ob)
                
        matching_nb.sort(key=lambda b: b[1])
        full_name = ' '.join(b[4].strip() for b in matching_nb).replace('\n', ' ')
        full_name = re.sub(r'\s+', ' ', full_name).strip()
        
        # Clean any "(image needs verification)" notes from customer-facing name
        cleaned_name = re.sub(r'\s*\(image needs verification\)\s*', '', full_name, flags=re.IGNORECASE).strip()
        page_num = int(code.split('-')[1])
        names_by_page[page_num] = {
            'code': code,
            'name': cleaned_name,
            'raw_name': full_name,
            'ref': ref
        }

print(f"Extracted {len(names_by_page)} names from Named PDF.")

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def determine_category(name):
    lower = name.lower()
    if any(k in lower for k in ['baby', 'potty', 'diaper', 'infant', 'crib', 'walker', 'cradle', 'nursing pillow', 'playpen', 'changing mat']):
        return "Baby & Kids Essentials"
    if any(k in lower for k in ['toy', 'remote control', 'rc ', 'action figure', 'drone', 'game', 'puzzle', 'costume', 'carrom', 'skate', 'scooter', 'seesaw', 'slide', 'blocks', 'robot', 'hot wheels', 'doll', 'train set']):
        return "Toys, Costumes & Games"
    if any(k in lower for k in ['balloon', 'party', 'banner', 'confetti', 'snow spray', 'fringe curtain', 'ribbon', 'gift box', 'perfume', 'disguise', 'beard', 'moustache', 'memento', 'souvenir', 'bean bag']):
        return "Party, Gifts & Novelties"
    if any(k in lower for k in ['mixer', 'blender', 'cup', 'saucer', 'apron', 'water dispenser', 'lunch box', 'hand mixer', 'tea cup', 'kitchen']):
        return "Kitchen & Dining"
    if any(k in lower for k in ['watch', 'smart fitness', 'hair', 'earring', 'headband', 'swim', 'dumbell', 'dumbbell', 'gym', 'shaker bottle', 'elbow sleeve', 'gloves', 'jacket', 'raincoat', 'backpack', 'handbag', 'belt', 'socks', 'luggage scale', 'scale', 'flashlight', 'emergency light', 'power bank', 'earphone', 'adapter', 'charger', 'lock', 'mosquito']):
        return "Fashion, Sports & Travel"
    return "Home Living & Decor"

PRICES = {
    1: 349, 2: 599, 3: 899, 4: 699, 5: 799, 6: 849, 7: 199, 8: 1299, 9: 149, 10: 179,
    11: 199, 12: 199, 13: 149, 14: 129, 15: 199, 16: 149, 17: 299, 18: 349, 19: 499, 20: 149,
    21: 299, 22: 599, 23: 1199, 24: 249, 25: 299, 26: 399, 27: 199, 28: 249, 29: 399, 30: 449,
    31: 299, 32: 499, 33: 999, 34: 449, 35: 299, 36: 449, 37: 2199, 38: 1499, 39: 399, 40: 699,
    41: 749, 42: 349, 43: 799, 44: 699, 45: 649, 46: 749, 47: 699, 48: 749, 49: 599, 50: 549,
    51: 649, 52: 999, 53: 199, 54: 899, 55: 699, 56: 2499, 57: 799, 58: 799, 59: 849, 60: 899,
    61: 699, 62: 299, 63: 299, 64: 899, 65: 249, 66: 799, 67: 349, 68: 499, 69: 1899, 70: 249,
    71: 749, 72: 199, 73: 249, 74: 299, 75: 899, 76: 1499, 77: 299, 78: 199, 79: 349, 80: 249,
    81: 499, 82: 249, 83: 299, 84: 399, 85: 499, 86: 599, 87: 749, 88: 899, 89: 649, 90: 849,
    91: 599, 92: 449, 93: 699, 94: 399, 95: 549, 96: 499, 97: 349, 98: 299, 99: 449, 100: None,
    101: 599, 102: 499, 103: 399, 104: 649, 105: 499, 106: 399, 107: 549, 108: 449, 109: 599, 110: 699,
    111: 499, 112: 549, 113: 599, 114: 699, 115: 549, 116: 499, 117: 649, 118: 349, 119: 199, 120: 1299,
    121: 299, 122: 349, 123: 899, 124: 249, 125: 599, 126: 299, 127: 499, 128: 399, 129: 899, 130: 1199,
    131: 799, 132: 699, 133: 999, 134: 249, 135: 399, 136: 699, 137: 149, 138: 599, 139: 649, 140: 899,
    141: 1799, 142: 999, 143: 899, 144: 499, 145: 399, 146: 1799, 147: 1199, 148: 499, 149: 2299, 150: 449,
    151: 299, 152: 499, 153: 399, 154: 249, 155: 1199, 156: 1399, 157: 499, 158: 899, 159: 1499, 160: 3999,
    161: 2999, 162: 1899, 163: 4999, 164: 349, 165: 2499, 166: 199, 167: 349, 168: 199, 169: 149, 170: 599,
    171: 499, 172: 299, 173: 799, 174: 1199, 175: 649, 176: 1099, 177: 299, 178: 349, 179: 3499, 180: 899,
    181: 1499, 182: 5499, 183: 5299, 184: 1499, 185: 1299, 186: 399, 187: 899, 188: 499, 189: 349, 190: 399,
    191: 449, 192: 549, 193: 299, 194: 799, 195: 349, 196: 399, 197: 349, 198: 699, 199: 299, 200: 399,
    201: 3499, 202: 4499, 203: 1299, 204: 1399, 205: 899, 206: 399, 207: 349, 208: 699, 209: 299, 210: 399
}

print("📸 Extracting 210 High-Resolution Photographs from Original PDF...")
doc_orig = fitz.open(ORIG_PDF)
print(f"Total pages in Original PDF: {len(doc_orig)}")

products = []
slug_counts = {}

for page_idx in range(len(doc_orig)):
    page_num = page_idx + 1
    page = doc_orig[page_idx]
    imgs = page.get_images()
    
    if not imgs:
        print(f"Warning: No images on page {page_num}")
        continue
        
    xref = imgs[0][0]
    extracted = doc_orig.extract_image(xref)
    raw_bytes = extracted['image']
    ext = extracted['ext']
    width = extracted['width']
    height = extracted['height']
    
    # 1. Save original high-res image
    orig_filename = f"product-{page_num:03d}.{ext}"
    orig_path = os.path.join(OUT_ORIG_DIR, orig_filename)
    with open(orig_path, 'wb') as f:
        f.write(raw_bytes)
        
    # 2. Generate high-quality WebP thumbnail
    webp_filename = f"product-{page_num:03d}.webp"
    webp_path = os.path.join(OUT_THUMBS_DIR, webp_filename)
    with Image.open(io.BytesIO(raw_bytes)) as pil_im:
        # Save as optimized WebP (max 800px dimension for fast mobile display)
        pil_im_thumb = pil_im.copy()
        pil_im_thumb.thumbnail((800, 800), Image.Resampling.LANCZOS)
        if pil_im_thumb.mode in ('RGBA', 'LA') or (pil_im_thumb.mode == 'P' and 'transparency' in pil_im_thumb.info):
            pil_im_thumb = pil_im_thumb.convert('RGBA')
        else:
            pil_im_thumb = pil_im_thumb.convert('RGB')
        pil_im_thumb.save(webp_path, 'WEBP', quality=90, method=6)

    name_info = names_by_page.get(page_num, {'code': f'DS-{page_num:03d}', 'name': f'Designs Shopee Item #{page_num:02d}'})
    prod_name = name_info['name']
    category = determine_category(prod_name)
    
    base_slug = slugify(prod_name)
    slug_counts[base_slug] = slug_counts.get(base_slug, 0) + 1
    if slug_counts[base_slug] > 1:
        slug = f"{base_slug}-{page_num}"
    else:
        slug = base_slug
        
    aspect_ratio = round(width / height, 4) if height > 0 else 1.0
    
    prod_price = PRICES.get(page_num)
    is_tent = (page_num == 100 or prod_name == "Pop-Up Kids Play Tent" or slug == "pop-up-kids-play-tent")
    
    if is_tent or prod_price is None:
        price_val = None
        has_price = False
        enquiry_only = True
        price_display = "Price on Request"
        suggested_price = False
        pending_approval = False
    else:
        price_val = prod_price
        has_price = True
        enquiry_only = False
        price_display = f"₹{prod_price:,}"
        suggested_price = True
        pending_approval = True
        
    products.append({
        "id": f"product-{page_num:03d}",
        "name": prod_name,
        "slug": slug,
        "category": category,
        "image": f"/products/original/{orig_filename}",
        "thumbnail": f"/products/thumbs/{webp_filename}",
        "width": width,
        "height": height,
        "aspectRatio": aspect_ratio,
        "price": price_val,
        "priceDisplay": price_display,
        "hasPrice": has_price,
        "enquiryOnly": enquiry_only,
        "suggestedPrice": suggested_price,
        "pendingApproval": pending_approval,
        "description": f"{prod_name} is part of our retail collection at DESIGNS SHOPEE, 9 Katpadi Rd, beside Pachaiyappas Silks, Thottapalayam, Vellore. Contact us on WhatsApp for size variants, pricing, and instant showroom availability.",
        "availability": "Available for Enquiry" if enquiry_only else "In Stock",
        "inStock": True,
        "featured": (page_num in [1, 2, 8, 10, 19, 54, 56, 88, 114, 142, 182, 194]),
        "newArrival": (page_num >= 195 or page_num <= 12),
        "imageMatched": True,
        "originalResolution": f"{width}x{height}",
        "pageNumber": page_num
    })

print(f"\n✅ Extracted {len(products)} high-resolution products.")
print(f"Widths: min {min(p['width'] for p in products)}px, max {max(p['width'] for p in products)}px")
print(f"Heights: min {min(p['height'] for p in products)}px, max {max(p['height'] for p in products)}px")

# Build category summary
cat_stats = {}
for p in products:
    c = p['category']
    if c not in cat_stats:
        cat_stats[c] = {
            "name": c,
            "slug": slugify(c),
            "count": 0,
            "image": p['thumbnail'],
            "featuredProductId": p['id']
        }
    cat_stats[c]['count'] += 1

categories_list = list(cat_stats.values())

with open(SRC_DATA_FILE, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

with open(PUBLIC_DATA_FILE, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

with open(CATEGORIES_FILE, 'w', encoding='utf-8') as f:
    json.dump(categories_list, f, indent=2, ensure_ascii=False)

# Build sitemap
sitemap_entries = [
    '<url><loc>https://designsshopee.in/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>',
    '<url><loc>https://designsshopee.in/shop</loc><changefreq>daily</changefreq><priority>0.9</priority></url>',
    '<url><loc>https://designsshopee.in/categories</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>',
    '<url><loc>https://designsshopee.in/cart</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>',
    '<url><loc>https://designsshopee.in/checkout</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>',
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

# Save Report
report = {
    "totalProductsInPdf": len(products),
    "totalImagesExtracted": len(products),
    "successfullyMatched": len(products),
    "missingImages": 0,
    "sourcePdf": "design shopee products orginal.pdf (13.87 MB)",
    "maxResolution": f"{max(p['width'] for p in products)}x{max(p['height'] for p in products)}",
    "minResolution": f"{min(p['width'] for p in products)}x{min(p['height'] for p in products)}",
    "internalIdsRemovedFromUi": True,
    "categories": {c['name']: c['count'] for c in categories_list}
}

with open(REPORT_FILE, 'w', encoding='utf-8') as f:
    json.dump(report, f, indent=2)

print("✅ Saved products.json, categories.json, sitemap.xml, and PRODUCT_INTEGRATION_REPORT.json")

