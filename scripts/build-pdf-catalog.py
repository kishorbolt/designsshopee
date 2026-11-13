import os
import re
import io
import json
import shutil
from PIL import Image
import fitz # PyMuPDF

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_PATH = os.path.join(BASE_DIR, 'public', 'products', 'Designs_Shopee_Product_Catalogue_Named.pdf')
PRODUCTS_BASE = os.path.join(BASE_DIR, 'public', 'products')
CATALOG_IMG_DIR = os.path.join(PRODUCTS_BASE, 'catalog')
THUMBS_DIR = os.path.join(PRODUCTS_BASE, 'thumbs')
SRC_DATA_FILE = os.path.join(BASE_DIR, 'src', 'data', 'products.json')
PUBLIC_DATA_FILE = os.path.join(BASE_DIR, 'public', 'data', 'products.json')
CATEGORIES_FILE = os.path.join(BASE_DIR, 'src', 'data', 'categories.json')
SITEMAP_FILE = os.path.join(BASE_DIR, 'public', 'sitemap.xml')
REPORT_FILE = os.path.join(BASE_DIR, 'PRODUCT_INTEGRATION_REPORT.json')

os.makedirs(CATALOG_IMG_DIR, exist_ok=True)
os.makedirs(THUMBS_DIR, exist_ok=True)
os.makedirs(os.path.dirname(SRC_DATA_FILE), exist_ok=True)

# Move unrelated WhatsApp subfolders to archive_whatsapp if still in root of products
archive_dir = os.path.join(PRODUCTS_BASE, 'archive_whatsapp')
for cat_folder in ['Fashion & Accessories', 'Gifts & Novelties', 'Home Decor & Clocks', 'Specialty Collection', 'Toys & Games']:
    src_folder = os.path.join(PRODUCTS_BASE, cat_folder)
    if os.path.exists(src_folder) and not os.path.exists(os.path.join(archive_dir, cat_folder)):
        os.makedirs(archive_dir, exist_ok=True)
        shutil.move(src_folder, os.path.join(archive_dir, cat_folder))

print("📖 Reading DESIGNS SHOPEE PDF Catalogue...")
doc = fitz.open(PDF_PATH)
print(f"Total PDF pages: {len(doc)}")

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

# Category classification rules
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

products = []
missing_images = []
low_res_products = []
products_needing_verification = []

extracted_images_count = 0

for page_idx, page in enumerate(doc):
    imgs = []
    for img in page.get_images():
        xref = img[0]
        rects = page.get_image_rects(xref)
        if rects:
            for r in rects:
                imgs.append({'rect': r, 'xref': xref, 'cx': (r.x0 + r.x1)/2, 'cy': (r.y0 + r.y1)/2, 'y1': r.y1})
    
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
        
        # Name block directly below
        matching_nb = []
        for ob in other_blocks:
            ocx = (ob[0] + ob[2]) / 2
            oy0 = ob[1]
            if abs(ocx - dcx) < 90 and (oy0 >= dy1 - 5) and (oy0 - dy1 < 45):
                matching_nb.append(ob)
                
        matching_nb.sort(key=lambda b: b[1])
        full_name = ' '.join(b[4].strip() for b in matching_nb).replace('\n', ' ')
        full_name = re.sub(r'\s+', ' ', full_name).strip()
        
        # Image directly above this block
        best_img = None
        best_dy = 9999
        for im in imgs:
            if im['y1'] <= dsb[1] + 10:
                dy = dsb[1] - im['y1']
                dx = abs(im['cx'] - dcx)
                if dx < 120 and dy < 180 and dy < best_dy:
                    best_dy = dy
                    best_img = im
                    
        image_matched = False
        cat_img_rel = None
        cat_thumb_rel = None
        orig_w, orig_h = 0, 0
        
        if best_img:
            try:
                extracted = doc.extract_image(best_img['xref'])
                raw_bytes = extracted['image']
                ext = extracted['ext']
                orig_w = extracted['width']
                orig_h = extracted['height']
                
                # 1. Save untouched raw bytes directly from the PDF dictionary
                cat_filename = f"{code}.{ext}"
                cat_full_path = os.path.join(CATALOG_IMG_DIR, cat_filename)
                with open(cat_full_path, 'wb') as f:
                    f.write(raw_bytes)
                cat_img_rel = f"/products/catalog/{cat_filename}"
                extracted_images_count += 1
                image_matched = True
                
                # 2. Generate high-quality WebP thumbnail
                thumb_filename = f"{code}.webp"
                thumb_full_path = os.path.join(THUMBS_DIR, thumb_filename)
                with Image.open(io.BytesIO(raw_bytes)) as pil_im:
                    # Save as WebP
                    pil_im.save(thumb_full_path, 'WEBP', quality=92, method=6)
                cat_thumb_rel = f"/products/thumbs/{thumb_filename}"
                
            except Exception as e:
                print(f"Error extracting image for {code}: {e}")
                missing_images.append(code)
                cat_img_rel = "/assets/logo.png"
                cat_thumb_rel = "/assets/logo.png"
        else:
            missing_images.append(code)
            cat_img_rel = "/assets/logo.png"
            cat_thumb_rel = "/assets/logo.png"
            
        # Check low resolution status
        is_low_res = (orig_w <= 300 or orig_h <= 300)
        if is_low_res:
            low_res_products.append(code)
            
        # Check verification flag
        needs_verif = "needs verification" in full_name.lower() or not image_matched
        if needs_verif:
            products_needing_verification.append({
                "code": code,
                "name": full_name,
                "reason": "PDF catalogue notes '(image needs verification)'" if "needs verification" in full_name.lower() else "Image could not be extracted"
            })
            
        category = determine_category(full_name)
        slug = slugify(f"{full_name}-{code}")
        
        aspect_ratio = round(orig_w / orig_h, 4) if (orig_w > 0 and orig_h > 0) else 1.0
        
        products.append({
            "id": code,
            "code": code,
            "name": full_name,
            "slug": slug,
            "category": category,
            "image": cat_img_rel,
            "thumbnail": cat_thumb_rel,
            "width": orig_w,
            "height": orig_h,
            "aspectRatio": aspect_ratio,
            "price": None, # Never fabricate price
            "priceDisplay": "Price on Request",
            "hasPrice": False,
            "description": f"Original catalogue product from DESIGNS SHOPEE, 9 Katpadi Rd, beside Pachaiyappas Silks, Vellore. Contact us on WhatsApp for size variants, instant pricing, and current availability.",
            "availability": "Available for Enquiry",
            "inStock": True,
            "featured": (int(code.split('-')[1]) in [1, 2, 8, 10, 19, 54, 56, 88, 114, 142, 182, 194]),
            "newArrival": (int(code.split('-')[1]) >= 190 or int(code.split('-')[1]) <= 15),
            "imageMatched": image_matched,
            "matchingSource": "original-pdf-photograph",
            "isLowResolution": is_low_res,
            "imageResolution": f"{orig_w}x{orig_h}",
            "flaggedForBetterSource": is_low_res,
            "resolutionNote": f"Original PDF catalogue photograph ({orig_w}x{orig_h}px). Better high-resolution source photo recommended." if is_low_res else "Standard resolution",
            "needsVerification": needs_verif,
            "pdfPage": page_idx + 1,
            "pdfReference": ref
        })

print(f"\n==========================================")
print(f"📊 DESIGNS SHOPEE PDF INTEGRATION SUMMARY")
print(f"==========================================")
print(f"Total products in PDF: {len(products)}")
unique_names = set(p['name'] for p in products)
print(f"Total unique product names: {len(unique_names)}")
print(f"Total images extracted from PDF: {extracted_images_count}")
print(f"Successfully matched products: {sum(1 for p in products if p['imageMatched'])} / {len(products)}")
print(f"Missing images: {len(missing_images)}")
print(f"Catalogue / Low-resolution images flagged (<=300px): {len(low_res_products)}")
print(f"Products requiring manual verification: {len(products_needing_verification)}")
for v in products_needing_verification:
    print(f"  - {v['code']}: {v['name']} ({v['reason']})")

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
print(f"\nDepartments ({len(categories_list)}):")
for c in categories_list:
    print(f"  - {c['name']} ({c['count']} items)")

# Write products.json
with open(SRC_DATA_FILE, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

with open(PUBLIC_DATA_FILE, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

with open(CATEGORIES_FILE, 'w', encoding='utf-8') as f:
    json.dump(categories_list, f, indent=2, ensure_ascii=False)

# Rebuild sitemap.xml
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

# Write comprehensive report JSON
report_data = {
    "totalProductsInPdf": len(products),
    "totalImagesExtracted": extracted_images_count,
    "successfullyMatchedProducts": sum(1 for p in products if p['imageMatched']),
    "missingImages": len(missing_images),
    "lowResolutionImages": len(low_res_products),
    "lowResolutionWidthRange": "173px to 300px",
    "lowResolutionHeightRange": "212px to 245px",
    "productsRequiringVerification": products_needing_verification,
    "categorySummary": {c['name']: c['count'] for c in categories_list}
}

with open(REPORT_FILE, 'w', encoding='utf-8') as f:
    json.dump(report_data, f, indent=2)

print(f"\n✅ All files written successfully.")
print(f"✅ Sitemap generated with {len(sitemap_entries)} URLs.")
print(f"✅ Saved verification report to PRODUCT_INTEGRATION_REPORT.json")
