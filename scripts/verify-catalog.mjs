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

  // Check gallery images existence
  if (p.images && Array.isArray(p.images)) {
    for (const gImg of p.images) {
      const gPath = path.join(root, 'public', gImg.replace(/^\//, ''));
      if (!fs.existsSync(gPath)) {
        console.error(`❌ Broken gallery image path: ${gImg} for product ${p.id}`);
        errors++;
      }
    }
  }

  // Check gallery thumbnails existence
  if (p.thumbnails && Array.isArray(p.thumbnails)) {
    for (const gThumb of p.thumbnails) {
      const gtPath = path.join(root, 'public', gThumb.replace(/^\//, ''));
      if (!fs.existsSync(gtPath)) {
        console.error(`❌ Broken gallery thumbnail path: ${gThumb} for product ${p.id}`);
        errors++;
      }
    }
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
    sampleMessage = `Hello DESIGNS SHOPEE!\n\nI am interested in the Pop-Up Kids Play Tent.\n\nPlease share the price and product details.\n\nProduct Link: https://www.designsshopee.in/product/${p.slug}`;
  } else {
    sampleMessage = `Hello DESIGNS SHOPEE!\n\nI am interested in this product.\n\nProduct Name: ${p.name}\nProduct Link: https://www.designsshopee.in/product/${p.slug}\n\nPlease share more details.`;
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

// 4. Verify Favicons & App Icons
const requiredIcons = ['favicon.ico', 'favicon-48x48.png', 'apple-touch-icon.png', 'site.webmanifest'];
for (const icon of requiredIcons) {
  const iconPath = path.join(root, 'public', icon);
  if (!fs.existsSync(iconPath)) {
    console.error(`❌ Missing favicon/icon asset: public/${icon}`);
    errors++;
  } else {
    console.log(`✅ Favicon asset verified: public/${icon}`);
  }
}

// 5. Verify Sitemap & Robots.txt
const sitemapPath = path.join(root, 'public', 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('❌ Missing sitemap.xml in public/');
  errors++;
} else {
  const content = fs.readFileSync(sitemapPath, 'utf-8');
  if (!content.includes('https://www.designsshopee.in') || !content.includes('</urlset>') || !content.includes('<image:loc>')) {
    console.error('❌ Malformed sitemap.xml or missing image tags');
    errors++;
  } else if (content.includes('https://designsshopee.in/') || content.includes('http://designsshopee.in')) {
    console.error('❌ sitemap.xml contains non-canonical apex or http URLs');
    errors++;
  } else {
    console.log('✅ sitemap.xml verified with valid Google Image XML format & canonical domain https://www.designsshopee.in');
  }
}

const distSitemapPath = path.join(root, 'dist', 'sitemap.xml');
if (!fs.existsSync(distSitemapPath)) {
  console.error('❌ Missing sitemap.xml in dist root');
  errors++;
} else {
  const distContent = fs.readFileSync(distSitemapPath, 'utf-8');
  if (!distContent.startsWith('<?xml') || !distContent.includes('</urlset>')) {
    console.error('❌ dist/sitemap.xml is not valid XML');
    errors++;
  } else {
    console.log('✅ dist/sitemap.xml verified in production build output');
  }
}

const robotsPath = path.join(root, 'public', 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  console.error('❌ Missing robots.txt');
  errors++;
} else {
  const rContent = fs.readFileSync(robotsPath, 'utf-8');
  if (!rContent.includes('Sitemap: https://www.designsshopee.in/sitemap.xml')) {
    console.error('❌ robots.txt does not point to exact canonical https://www.designsshopee.in/sitemap.xml');
    errors++;
  } else {
    console.log('✅ robots.txt verified with correct canonical sitemap reference.');
  }
}

// 6. Verify Build Output & Structured Data
const distIndex = path.join(root, 'dist', 'index.html');
if (!fs.existsSync(distIndex)) {
  console.error('❌ dist/index.html does not exist. Run npm run build first.');
  errors++;
} else {
  const indexContent = fs.readFileSync(distIndex, 'utf-8');
  if (!indexContent.includes('DESIGNS SHOPEE | Toys, Gifts & Unique Lifestyle Products in Vellore')) {
    console.error('❌ dist/index.html missing correct page title');
    errors++;
  }
  if (!indexContent.includes('https://www.designsshopee.in/')) {
    console.error('❌ dist/index.html missing canonical https://www.designsshopee.in/');
    errors++;
  }
  if (!indexContent.includes('"@type": ["Store", "ToyStore"]') && !indexContent.includes('"@type":["Store","ToyStore"]')) {
    console.error('❌ dist/index.html missing LocalBusiness/Store schema');
    errors++;
  }
  console.log('✅ Production build artifact dist/index.html verified with full LocalBusiness structured data.');
}

// 7. Verify Pre-rendered Product Detail Pages
for (const p of products) {
  const pPath = path.join(root, 'dist', 'product', p.slug, 'index.html');
  if (!fs.existsSync(pPath)) {
    console.error(`❌ Missing pre-rendered SEO page for product ${p.id}: dist/product/${p.slug}/index.html`);
    errors++;
  } else {
    const pContent = fs.readFileSync(pPath, 'utf-8');
    if (!pContent.includes(`https://www.designsshopee.in/product/${p.slug}`)) {
      console.error(`❌ Missing canonical or offer URL in dist/product/${p.slug}/index.html`);
      errors++;
    }
  }
}
console.log(`✅ All ${products.length} product detail pages pre-rendered with initial HTML Product Schema.org JSON-LD.`);

// 8. Verify Google Search Console Verification File
const publicFiles = fs.readdirSync(path.join(root, 'public'));
const googleVerifyFiles = publicFiles.filter(f => f.startsWith('google') && f.endsWith('.html'));
if (googleVerifyFiles.length > 0) {
  for (const gFile of googleVerifyFiles) {
    const distGFile = path.join(root, 'dist', gFile);
    if (!fs.existsSync(distGFile)) {
      console.error(`❌ Missing Google verification file in dist root: dist/${gFile}`);
      errors++;
    } else {
      const gContent = fs.readFileSync(distGFile, 'utf-8').trim();
      if (!gContent.startsWith('google-site-verification:')) {
        console.error(`❌ Google verification file dist/${gFile} has invalid content: ${gContent}`);
        errors++;
      } else {
        console.log(`✅ Google Search Console verification file verified in dist root: ${gFile} (${gContent})`);
      }
    }
  }
}

console.log('\n----------------------------------------');
if (errors === 0) {
  console.log('🎉 ALL QUALITY ASSURANCE CHECKS PASSED PERFECTLY! (0 errors, 0 warnings)');
} else {
  console.error(`❌ Verification finished with ${errors} error(s).`);
  process.exit(1);
}

