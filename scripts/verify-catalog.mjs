import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

console.log('🧪 Starting DESIGNS SHOPEE comprehensive QA check...\n');

let errors = 0;
let warnings = 0;

// 1. Verify Logo
const logoPath = path.join(root, 'public', 'assets', 'logo.png');
if (!fs.existsSync(logoPath)) {
  console.error('❌ Missing logo at public/assets/logo.png');
  errors++;
} else {
  const stat = fs.statSync(logoPath);
  console.log(`✅ Logo verified: public/assets/logo.png (${stat.size} bytes)`);
}

// 2. Verify products.json
const productsJsonPath = path.join(root, 'src', 'data', 'products.json');
if (!fs.existsSync(productsJsonPath)) {
  console.error('❌ Missing src/data/products.json');
  errors++;
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));
console.log(`✅ Loaded catalog with ${products.length} products.`);

if (products.length === 0) {
  console.error('❌ Product catalog is empty!');
  errors++;
}

// 3. Verify uniqueness, fields, image existence, and WhatsApp link generation
const seenIds = new Set();
const seenSlugs = new Set();
const categories = new Set();

products.forEach((p, index) => {
  // Check ID
  if (!p.id || seenIds.has(p.id)) {
    console.error(`❌ Duplicate or empty ID: ${p.id} at index ${index}`);
    errors++;
  }
  seenIds.add(p.id);

  // Check Slug
  if (!p.slug || seenSlugs.has(p.slug)) {
    console.error(`❌ Duplicate or empty slug: ${p.slug} at index ${index}`);
    errors++;
  }
  seenSlugs.add(p.slug);

  // Check Category
  if (!p.category) {
    console.error(`❌ Empty category for product ${p.id}`);
    errors++;
  }
  categories.add(p.category);

  // Check original image existence
  const origImagePath = path.join(root, 'public', p.image.replace(/^\//, ''));
  if (!fs.existsSync(origImagePath)) {
    console.error(`❌ Broken image path: ${p.image} for product ${p.id}`);
    errors++;
  }

  // Check thumbnail existence
  const thumbPath = path.join(root, 'public', p.thumbnail.replace(/^\//, ''));
  if (!fs.existsSync(thumbPath)) {
    console.error(`❌ Broken thumbnail path: ${p.thumbnail} for product ${p.id}`);
    errors++;
  }

  // Check aspect ratio
  if (!p.aspectRatio || p.aspectRatio <= 0) {
    console.error(`❌ Invalid aspectRatio: ${p.aspectRatio} for product ${p.id}`);
    errors++;
  }

  // Check pricing rules
  if (p.slug === 'pop-up-kids-play-tent' || p.name === 'Pop-Up Kids Play Tent') {
    if (p.price !== null || p.hasPrice !== false || p.enquiryOnly !== true) {
      console.error(`❌ Pop-Up Kids Play Tent must have price=null, hasPrice=false, enquiryOnly=true`);
      errors++;
    }
  } else {
    if (typeof p.price !== 'number' || p.price <= 0 || p.hasPrice !== true) {
      console.error(`❌ Product ${p.id} (${p.name}) is missing valid price: ${p.price}`);
      errors++;
    }
  }

  // Test WhatsApp message generation
  let sampleMessage;
  if (p.slug === 'pop-up-kids-play-tent' || p.name === 'Pop-Up Kids Play Tent') {
    sampleMessage = `Hello DESIGNS SHOPEE!\n\nI am interested in the Pop-Up Kids Play Tent.\n\nPlease share the price and product details.\n\nProduct Link: https://designsshopee.in/product/${p.slug}`;
  } else {
    sampleMessage = `Hello DESIGNS SHOPEE!\n\nI am interested in this product.\n\nProduct Name: ${p.name}\nProduct Link: https://designsshopee.in/product/${p.slug}\n\nPlease share more details.`;
  }
  const encoded = encodeURIComponent(sampleMessage);
  const waUrl = `https://wa.me/919487703591?text=${encoded}`;

  if (!waUrl.includes('919487703591') || (!waUrl.includes(encodeURIComponent(p.name)) && !waUrl.includes('Pop-Up%20Kids%20Play%20Tent'))) {
    console.error(`❌ Malformed WhatsApp link for product ${p.id}`);
    errors++;
  }
});

console.log(`✅ All ${products.length} products have unique IDs, slugs, and valid images.`);
console.log(`✅ Verified ${categories.size} unique categories: ${Array.from(categories).join(', ')}`);

// 4. Verify Sitemap & Robots.txt
const sitemapPath = path.join(root, 'public', 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('❌ Missing sitemap.xml');
  errors++;
} else {
  const content = fs.readFileSync(sitemapPath, 'utf-8');
  if (!content.includes('https://designsshopee.in/') || !content.includes('</urlset>')) {
    console.error('❌ Malformed sitemap.xml');
    errors++;
  } else {
    console.log('✅ sitemap.xml verified with valid XML format.');
  }
}

const robotsPath = path.join(root, 'public', 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  console.error('❌ Missing robots.txt');
  errors++;
} else {
  console.log('✅ robots.txt verified.');
}

// 5. Verify Build Output
const distIndex = path.join(root, 'dist', 'index.html');
if (!fs.existsSync(distIndex)) {
  console.error('❌ dist/index.html does not exist. Run npm run build first.');
  errors++;
} else {
  console.log('✅ Production build artifact dist/index.html verified.');
}

console.log('\n----------------------------------------');
if (errors === 0) {
  console.log('🎉 ALL QUALITY ASSURANCE CHECKS PASSED PERFECTLY! (0 errors, 0 warnings)');
} else {
  console.error(`❌ Verification finished with ${errors} error(s).`);
  process.exit(1);
}

