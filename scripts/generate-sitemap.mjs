import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const productsJsonPath = path.join(root, 'src', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));

const BASE_URL = 'https://www.designsshopee.in';

const escapeXml = (unsafe) => {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  '  <url>',
  `    <loc>${BASE_URL}/</loc>`,
  '    <changefreq>daily</changefreq>',
  '    <priority>1.0</priority>',
  '    <image:image>',
  `      <image:loc>${BASE_URL}/assets/logo.png</image:loc>`,
  '      <image:title>DESIGNS SHOPEE — Premier Toy &amp; Gift Showroom in Vellore</image:title>',
  '      <image:caption>DESIGNS SHOPEE showroom at 9, Katpadi Rd, beside Pachaiyappas Silks, Thottapalayam, Vellore</image:caption>',
  '    </image:image>',
  '  </url>',
  '  <url>',
  `    <loc>${BASE_URL}/about</loc>`,
  '    <changefreq>monthly</changefreq>',
  '    <priority>0.8</priority>',
  '  </url>'
];

for (const p of products) {
  const slug = p.slug;
  const pName = escapeXml(p.name);
  const desc = escapeXml(p.description || `${p.name} at DESIGNS SHOPEE, Vellore`);

  lines.push('  <url>');
  lines.push(`    <loc>${BASE_URL}/product/${slug}</loc>`);
  lines.push('    <changefreq>weekly</changefreq>');
  lines.push('    <priority>0.8</priority>');

  const images = (p.images && p.images.length > 0) ? p.images : [p.image];
  for (const imgPath of images) {
    // Verify file exists on disk in public
    const diskPath = path.join(root, 'public', imgPath.startsWith('/') ? imgPath.slice(1) : imgPath);
    if (!fs.existsSync(diskPath)) {
      console.error(`⚠️ Warning: Image in catalog does not exist on disk: ${diskPath}`);
    }
    const encodedImg = encodeURI(imgPath);
    const fullImgUrl = `${BASE_URL}${encodedImg}`;
    lines.push('    <image:image>');
    lines.push(`      <image:loc>${fullImgUrl}</image:loc>`);
    lines.push(`      <image:title>${pName}</image:title>`);
    lines.push(`      <image:caption>${desc}</image:caption>`);
    lines.push('    </image:image>');
  }

  lines.push('  </url>');
}

lines.push('</urlset>');
const xmlContent = lines.join('\n') + '\n';

// Write to public/sitemap.xml
fs.writeFileSync(path.join(root, 'public', 'sitemap.xml'), xmlContent, 'utf-8');

// If dist exists, also copy directly to dist/sitemap.xml
const distPath = path.join(root, 'dist');
if (fs.existsSync(distPath)) {
  fs.writeFileSync(path.join(distPath, 'sitemap.xml'), xmlContent, 'utf-8');
}

console.log(`🗺️ Generated Google Image Sitemap with ${products.length + 2} canonical URLs (Homepage, About + ${products.length} Products): public/sitemap.xml`);
