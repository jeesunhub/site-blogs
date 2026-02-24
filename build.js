const fs = require('fs');
const path = require('path');
require('dotenv').config();

const frontendPath = path.resolve(__dirname, 'frontend');
const distPath = path.resolve(frontendPath, 'dist');

// 1. Create dist directory if it doesn't exist
if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
}

// 2. Helper to copy and replace files
function processFile(relativePath) {
    const src = path.resolve(frontendPath, relativePath);
    const dest = path.resolve(distPath, relativePath);

    // CRITICAL: Stop if we are trying to process the dist directory itself
    // Path.resolve handles different separators and trailing slashes
    if (src === distPath || src.startsWith(distPath + path.sep)) {
        return;
    }

    const stats = fs.statSync(src);

    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(file => {
            processFile(path.join(relativePath, file));
        });
        return;
    }

    let content = fs.readFileSync(src, 'utf8');

    // Replace Clerk Publishable Key
    if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        content = content.replace(/__CLERK_PUBLISHABLE_KEY__/g, process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
    }

    // Replace API Base URL
    const apiBaseUrl = process.env.WORKER_URL || 'https://site-blogs.iamjeesun.workers.dev';
    content = content.replace(/__API_BASE_URL__/g, apiBaseUrl);

    fs.writeFileSync(dest, content);
    console.log(`Processed ${relativePath}`);
}

// 3. Process all files in frontend (excluding dist)
fs.readdirSync(frontendPath).forEach(file => {
    if (file === 'dist') return;
    processFile(file);
});

// 4. Process wrangler.toml
const wranglerSrc = path.resolve(__dirname, 'worker', 'wrangler.toml.template');
const wranglerDest = path.resolve(__dirname, 'worker', 'wrangler.toml');

if (fs.existsSync(wranglerSrc)) {
    let content = fs.readFileSync(wranglerSrc, 'utf8');
    if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        content = content.replace(/__CLERK_PUBLISHABLE_KEY__/g, process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
    }
    if (process.env.CLERK_SECRET_KEY) {
        content = content.replace(/__CLERK_SECRET_KEY__/g, process.env.CLERK_SECRET_KEY);
    }
    fs.writeFileSync(wranglerDest, content);
    console.log('Processed wrangler.toml.template -> wrangler.toml');
}

console.log(`Build complete: Files are in ${distPath}`);
