import json

with open('src/data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

base_url = 'https://designsshopee.vercel.app'

lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    f'<url><loc>{base_url}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>',
    f'<url><loc>{base_url}/about</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>',
    f'<url><loc>{base_url}/cart</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>',
    f'<url><loc>{base_url}/checkout</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>'
]

for p in products:
    lines.append(f'<url><loc>{base_url}/product/{p["slug"]}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>')

lines.append('</urlset>')

content = '\n'.join(lines) + '\n'

with open('public/sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(content)

print(f'Wrote sitemap.xml with {len(products) + 4} URLs!')
