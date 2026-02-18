const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.resolve(__dirname, '../dist/index.html');

try {
    let content = fs.readFileSync(indexHtmlPath, 'utf8');

    // Remove crossorigin attribute from script and link tags
    content = content.replace(/crossorigin/g, '');

    // Also remove type="module" just in case Electron has a fit, but Vite output usually needs it.
    // Actually, Vite outputs modules which need type="module". Electron supports modules.
    // So we only remove crossorigin which is problematic for file:// protocol.

    fs.writeFileSync(indexHtmlPath, content);
    console.log('Successfully removed crossorigin attributes from index.html');
} catch (err) {
    console.error('Error modifying index.html:', err);
    process.exit(1);
}
