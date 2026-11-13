import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pythonScript = path.join(__dirname, 'extract_original_pdf.py');

console.log('🔍 Running DESIGNS SHOPEE Original PDF extraction & WebP generation...');
try {
  execSync(`python "${pythonScript}"`, { encoding: 'utf-8', stdio: 'inherit' });
  console.log('✅ Extraction & catalog generation complete!');
} catch (error) {
  console.error('❌ Error during extraction:', error);
  process.exit(1);
}
