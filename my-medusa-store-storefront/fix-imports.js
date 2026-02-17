const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        const original = content;
        content = content.replace(/@lib\//g, '@/lib/');
        content = content.replace(/@modules\//g, '@/modules/');
        content = content.replace(/@pages\//g, '@/pages/');
        if (content !== original) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Fixed: ${filePath}`);
        }
      } catch (e) {
        console.error(`Error processing ${filePath}:`, e.message);
      }
    }
  });
}

walkDir(srcDir);
console.log('Done!');
