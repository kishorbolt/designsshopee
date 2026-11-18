import json
import os
import glob

with open('src/data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

print(f"Total unique products: {len(products)}")

# Count newly added raw image files in public/products/*.png
new_pngs = glob.glob('public/products/*.png')
print(f"Total newly added product image files: {len(new_pngs)}")

multi_images = [p for p in products if len(p.get('images', [])) > 1]
print(f"Number of products with multiple gallery images: {len(multi_images)}")
for p in multi_images:
    print(f"  • {p['name']} ({p['id']}): {len(p['images'])} camera angles | MRP: ₹{p.get('mrp'):,} | Selling: ₹{p.get('price'):,}")

single_price = [p for p in products if p.get('mrp') is None and p.get('price') is not None]
print(f"Products with single verified price: {len(single_price)}")

enquiry_only = [p for p in products if p.get('enquiryOnly') or p.get('price') is None]
print(f"Products enquiry-only (no price): {len(enquiry_only)} ({enquiry_only[0]['name']})")

needs_review = [p for p in products if p.get('needsPriceReview')]
print(f"Number of products needing manual price review: {len(needs_review)}")

missing = 0
for p in products:
    for img in p.get('images', [p['image']]):
        if not os.path.exists('public' + img):
            missing += 1
            print(f"Missing: {img}")
    for th in p.get('thumbnails', [p['thumbnail']]):
        if not os.path.exists('public' + th):
            missing += 1
            print(f"Missing thumb: {th}")

print(f"Missing or invalid images: {missing}")
