import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const distIndexHtml = path.join(root, 'dist', 'index.html');
const productsJsonPath = path.join(root, 'src', 'data', 'products.json');

if (!fs.existsSync(distIndexHtml)) {
  console.error('❌ dist/index.html does not exist. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(distIndexHtml, 'utf-8');
const products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));
const BASE_URL = 'https://www.designsshopee.in';

console.log('⚡ Pre-rendering initial HTML metadata & structured data for SEO...');

// 1. Pre-render Product Detail Pages
for (const product of products) {
  const productDir = path.join(root, 'dist', 'product', product.slug);
  fs.mkdirSync(productDir, { recursive: true });

  const pageTitle = `${product.name} | Toys & Gifts in Vellore | DESIGNS SHOPEE`;
  const pageDesc = `${product.description} Available in-store at DESIGNS SHOPEE, Katpadi Road, Vellore with direct WhatsApp order assistance.`;
  const canonicalUrl = `${BASE_URL}/product/${product.slug}`;
  const primaryImgUrl = `${BASE_URL}${encodeURI(product.image)}`;
  const galleryImages = (product.images && product.images.length > 0 ? product.images : [product.image])
    .map(img => `${BASE_URL}${encodeURI(img)}`);

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'image': galleryImages,
    'description': product.description,
    'sku': product.code || product.id,
    'mpn': product.id,
    'category': product.category,
    'brand': {
      '@type': 'Brand',
      'name': 'DESIGNS SHOPEE'
    },
    'offers': {
      '@type': 'Offer',
      'url': canonicalUrl,
      'priceCurrency': 'INR',
      'price': product.price || 0,
      'priceValidUntil': '2027-12-31',
      'itemCondition': 'https://schema.org/NewCondition',
      'availability': 'https://schema.org/InStock',
      'seller': {
        '@type': 'Store',
        'name': 'DESIGNS SHOPEE',
        'url': `${BASE_URL}/`,
        'telephone': '+919487703591',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '9, Katpadi Road, beside Pachaiyappas Silks',
          'addressLocality': 'Thottapalayam, Vellore',
          'addressRegion': 'Tamil Nadu',
          'postalCode': '632004',
          'addressCountry': 'IN'
        }
      }
    }
  };

  let html = baseHtml;
  // Replace Title
  html = html.replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`);
  // Replace Canonical
  html = html.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonicalUrl}" />`);
  // Replace Meta Description
  html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${pageDesc}" />`);
  // Replace Open Graph tags
  html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${pageTitle}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${pageDesc}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${primaryImgUrl}" />`);
  html = html.replace(/<meta property="og:type" content=".*?" \/>/, `<meta property="og:type" content="product" />`);
  // Replace Twitter tags
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${pageTitle}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${pageDesc}" />`);
  html = html.replace(/<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${primaryImgUrl}" />`);

  // Inject Product JSON-LD before </head>
  const scriptTag = `\n    <!-- Pre-rendered Schema.org Product JSON-LD -->\n    <script type="application/ld+json" id="product-json-ld">\n${JSON.stringify(productLd, null, 2)}\n    </script>\n  </head>`;
  html = html.replace('</head>', scriptTag);

  fs.writeFileSync(path.join(productDir, 'index.html'), html, 'utf-8');
  console.log(`✅ Pre-rendered SEO page: /product/${product.slug}`);
}

// 2. Pre-render About Page
const aboutDir = path.join(root, 'dist', 'about');
fs.mkdirSync(aboutDir, { recursive: true });
const aboutTitle = 'About Us | DESIGNS SHOPEE — Premier Toy & Gift Showroom in Vellore';
const aboutDesc = "Learn about DESIGNS SHOPEE, Vellore's trusted retail toy and gift showroom at 9 Katpadi Road beside Pachaiyappas Silks, Thottapalayam. Explore novelty toys, return gifts, clocks and kids essentials.";
const aboutCanonical = `${BASE_URL}/about`;

let aboutHtml = baseHtml;
aboutHtml = aboutHtml.replace(/<title>.*?<\/title>/, `<title>${aboutTitle}</title>`);
aboutHtml = aboutHtml.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${aboutCanonical}" />`);
aboutHtml = aboutHtml.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${aboutDesc}" />`);
aboutHtml = aboutHtml.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${aboutTitle}" />`);
aboutHtml = aboutHtml.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${aboutDesc}" />`);
aboutHtml = aboutHtml.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${aboutCanonical}" />`);
aboutHtml = aboutHtml.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${aboutTitle}" />`);
aboutHtml = aboutHtml.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${aboutDesc}" />`);
fs.writeFileSync(path.join(aboutDir, 'index.html'), aboutHtml, 'utf-8');
console.log('✅ Pre-rendered SEO page: /about');

console.log('🎉 Initial HTML SEO pre-rendering complete for all routes!');
