import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pythonScript = path.join(__dirname, 'extract_original_pdf.py');

const srcProductsJson = path.join(root, 'src', 'data', 'products.json');
const publicProductsJson = path.join(root, 'public', 'data', 'products.json');
const srcCategoriesJson = path.join(root, 'src', 'data', 'categories.json');
const sitemapFile = path.join(root, 'public', 'sitemap.xml');

const forceReextract = process.argv.includes('--force');

console.log('🔍 Checking DESIGNS SHOPEE product catalog & image assets...');

function checkExistingAssets() {
  if (forceReextract) {
    console.log('⚡ Force re-extraction requested via --force flag.');
    return { valid: false, reason: 'Force flag active' };
  }

  // 1. Check src/data/products.json
  if (!fs.existsSync(srcProductsJson)) {
    return { valid: false, reason: 'Missing src/data/products.json' };
  }

  let products;
  try {
    products = JSON.parse(fs.readFileSync(srcProductsJson, 'utf-8'));
    if (!Array.isArray(products) || products.length < 210) {
      return { valid: false, reason: `Incomplete products catalog (${products?.length || 0} items, expected >= 210)` };
    }
  } catch (err) {
    return { valid: false, reason: `Failed to parse src/data/products.json: ${err.message}` };
  }

  // 2. Check src/data/categories.json
  if (!fs.existsSync(srcCategoriesJson)) {
    return { valid: false, reason: 'Missing src/data/categories.json' };
  }

  // 3. Check sample and boundary images to ensure original photos & thumbs exist
  let missingImages = 0;
  for (const p of products) {
    const origPath = path.join(root, 'public', p.image.replace(/^\//, ''));
    const thumbPath = path.join(root, 'public', p.thumbnail.replace(/^\//, ''));
    if (!fs.existsSync(origPath) || !fs.existsSync(thumbPath)) {
      missingImages++;
      if (missingImages <= 3) {
        console.warn(`⚠️ Missing image on disk for ${p.id}: ${p.image} or ${p.thumbnail}`);
      }
    }
  }

  if (missingImages > 0) {
    return { valid: false, reason: `${missingImages} product image(s) missing from public directory` };
  }

  // 4. Ensure public/data/products.json is synced
  if (!fs.existsSync(publicProductsJson)) {
    try {
      fs.mkdirSync(path.dirname(publicProductsJson), { recursive: true });
      fs.copyFileSync(srcProductsJson, publicProductsJson);
      console.log('✅ Synced src/data/products.json to public/data/products.json');
    } catch (e) {
      console.warn('⚠️ Could not copy to public/data/products.json:', e.message);
    }
  }

  return { valid: true, count: products.length };
}

const status = checkExistingAssets();

if (status.valid) {
  console.log(`✅ Verified product catalog already present: ${status.count} products.`);
  console.log('✅ All original high-resolution photographs & WebP thumbnails verified.');
  console.log('⚡ Using existing verified generated data (skipping redundant PDF extraction during build).');
  process.exit(0);
}

// Assets need extraction or --force was specified
console.log(`ℹ️ Extraction required: ${status.reason}`);
console.log('📸 Running DESIGNS SHOPEE Original PDF extraction & WebP generation...');

// Find suitable python executable (try 'python3' first on Linux/macOS/Vercel, then 'python')
function findPython() {
  const candidates = process.platform === 'win32' ? ['python', 'python3', 'py'] : ['python3', 'python'];
  for (const cmd of candidates) {
    const probe = spawnSync(cmd, ['--version'], { encoding: 'utf-8' });
    if (!probe.error && probe.status === 0) {
      return cmd;
    }
  }
  return null;
}

const pythonBin = findPython();

if (!pythonBin) {
  console.error('❌ Error: Neither python3 nor python was found in PATH.');
  console.error('To run extraction, please ensure Python 3 is installed.');
  console.error('Required dependencies can be installed via: pip install -r requirements.txt');
  process.exit(1);
}

console.log(`Using Python executable: ${pythonBin}`);

const result = spawnSync(pythonBin, [pythonScript], {
  encoding: 'utf-8',
  stdio: ['inherit', 'pipe', 'pipe']
});

if (result.stdout && result.stdout.trim()) {
  console.log(result.stdout.trim());
}

if (result.error || result.status !== 0) {
  console.error(`\n❌ Python extraction failed with status code: ${result.status}`);
  if (result.error) {
    console.error('Process Execution Error:', result.error);
  }
  if (result.stderr && result.stderr.trim()) {
    console.error('\n--- Python stderr ---');
    console.error(result.stderr.trim());
    console.error('---------------------\n');
  }
  if (result.stdout && result.stdout.trim()) {
    console.error('--- Python stdout ---');
    console.error(result.stdout.trim());
    console.error('---------------------\n');
  }
  console.error('💡 If dependencies are missing, install them with: pip install -r requirements.txt');
  process.exit(result.status || 1);
}

console.log('✅ Extraction & catalog generation complete!');
