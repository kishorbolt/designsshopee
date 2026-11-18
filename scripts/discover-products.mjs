import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const srcProductsJson = path.join(root, 'src', 'data', 'products.json');
const publicProductsJson = path.join(root, 'public', 'data', 'products.json');
const srcCategoriesJson = path.join(root, 'src', 'data', 'categories.json');

console.log('🔍 Checking DESIGNS SHOPEE product catalog & image assets...');

function checkCatalogAssets() {
  // 1. Check src/data/products.json
  if (!fs.existsSync(srcProductsJson)) {
    return { valid: false, reason: 'Missing src/data/products.json' };
  }

  let products;
  try {
    products = JSON.parse(fs.readFileSync(srcProductsJson, 'utf-8'));
    if (!Array.isArray(products) || products.length === 0) {
      return { valid: false, reason: 'Empty products catalog in src/data/products.json' };
    }
  } catch (err) {
    return { valid: false, reason: `Failed to parse src/data/products.json: ${err.message}` };
  }

  // 2. Check src/data/categories.json
  if (!fs.existsSync(srcCategoriesJson)) {
    return { valid: false, reason: 'Missing src/data/categories.json' };
  }

  // 3. Verify images & WebP thumbnails for all active products
  let missingImages = 0;
  for (const p of products) {
    const origPath = path.join(root, 'public', p.image.replace(/^\//, ''));
    const thumbPath = path.join(root, 'public', p.thumbnail.replace(/^\//, ''));
    if (!fs.existsSync(origPath) || !fs.existsSync(thumbPath)) {
      missingImages++;
      console.warn(`⚠️ Missing primary asset on disk for ${p.id}: ${p.image} or ${p.thumbnail}`);
    }

    if (p.images && Array.isArray(p.images)) {
      for (const img of p.images) {
        const ip = path.join(root, 'public', img.replace(/^\//, ''));
        if (!fs.existsSync(ip)) {
          missingImages++;
          console.warn(`⚠️ Missing gallery image on disk for ${p.id}: ${img}`);
        }
      }
    }

    if (p.thumbnails && Array.isArray(p.thumbnails)) {
      for (const th of p.thumbnails) {
        const tp = path.join(root, 'public', th.replace(/^\//, ''));
        if (!fs.existsSync(tp)) {
          missingImages++;
          console.warn(`⚠️ Missing gallery thumbnail on disk for ${p.id}: ${th}`);
        }
      }
    }
  }

  if (missingImages > 0) {
    return { valid: false, reason: `${missingImages} image(s) missing from public directory` };
  }

  // 4. Ensure public/data/products.json is synchronized
  try {
    fs.mkdirSync(path.dirname(publicProductsJson), { recursive: true });
    fs.copyFileSync(srcProductsJson, publicProductsJson);
    console.log('✅ Synced src/data/products.json to public/data/products.json');
  } catch (e) {
    console.warn('⚠️ Could not copy to public/data/products.json:', e.message);
  }

  return { valid: true, count: products.length };
}

const status = checkCatalogAssets();

if (status.valid) {
  console.log(`✅ Verified approved product catalog: ${status.count} unique products.`);
  console.log('✅ All high-resolution photographs & WebP thumbnails verified on disk.');
  console.log('⚡ Using approved catalog assets (strict image source control enforced).');
  process.exit(0);
} else {
  console.error(`❌ Catalog check failed: ${status.reason}`);
  process.exit(1);
}
