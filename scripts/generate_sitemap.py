import json
import urllib.parse
from xml.sax.saxutils import escape

with open('src/data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

base_url = 'https://www.designsshopee.in'

lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    '  <url>',
    f'    <loc>{base_url}/</loc>',
    '    <changefreq>daily</changefreq>',
    '    <priority>1.0</priority>',
    '    <image:image>',
    f'      <image:loc>{base_url}/assets/logo.png</image:loc>',
    '      <image:title>DESIGNS SHOPEE — Premier Toy &amp; Gift Showroom in Vellore</image:title>',
    '      <image:caption>DESIGNS SHOPEE showroom at 9, Katpadi Rd, beside Pachaiyappas Silks, Thottapalayam, Vellore</image:caption>',
    '    </image:image>',
    '  </url>',
    '  <url>',
    f'    <loc>{base_url}/about</loc>',
    '    <changefreq>monthly</changefreq>',
    '    <priority>0.8</priority>',
    '  </url>',
    '  <url>',
    f'    <loc>{base_url}/cart</loc>',
    '    <changefreq>monthly</changefreq>',
    '    <priority>0.6</priority>',
    '  </url>',
    '  <url>',
    f'    <loc>{base_url}/checkout</loc>',
    '    <changefreq>monthly</changefreq>',
    '    <priority>0.6</priority>',
    '  </url>'
]

for p in products:
    slug = p['slug']
    p_name = escape(p['name'])
    desc = escape(p.get('description', f"{p['name']} at DESIGNS SHOPEE, Vellore"))
    
    product_lines = [
        '  <url>',
        f'    <loc>{base_url}/product/{slug}</loc>',
        '    <changefreq>weekly</changefreq>',
        '    <priority>0.8</priority>'
    ]
    
    images = p.get('images', [p['image']])
    for img_path in images:
        encoded_img = urllib.parse.quote(img_path, safe='/:')
        full_img_url = f"{base_url}{encoded_img}"
        product_lines.extend([
            '    <image:image>',
            f'      <image:loc>{full_img_url}</image:loc>',
            f'      <image:title>{p_name}</image:title>',
            f'      <image:caption>{desc}</image:caption>',
            '    </image:image>'
        ])
    
    product_lines.append('  </url>')
    lines.extend(product_lines)

lines.append('</urlset>')

content = '\n'.join(lines) + '\n'

with open('public/sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(content)

print(f'Wrote Google Image Sitemap with {len(products) + 4} URLs to public/sitemap.xml!')
