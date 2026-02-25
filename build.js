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
        const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
        const maskedKey = key.substring(0, 10) + '...' + key.substring(key.length - 4);
        content = content.replace(/__CLERK_PUBLISHABLE_KEY__/g, key);

        if (relativePath.endsWith('.html')) {
            console.log(`[BUILD] Replaced Clerk Key placeholder with: ${maskedKey} in ${relativePath}`);
            // Verification check
            if (content.includes('__CLERK_PUBLISHABLE_KEY__')) {
                console.error(`[FATAL ERROR] Replacement failed in ${relativePath}! Placeholder still exists.`);
                process.exit(1);
            }
        }
    } else {
        if (relativePath.endsWith('.html')) {
            console.error(`[FATAL ERROR] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing!`);
            console.error(`Please add it to Cloudflare Pages -> Settings -> Environment Variables -> Build Environment`);
            process.exit(1); // Stop the build
        }
    }

    // Replace API Base URL
    const apiBaseUrl = process.env.WORKER_URL || 'https://site-blogs-api.iamjeesun.workers.dev';
    content = content.replace(/__API_BASE_URL__/g, apiBaseUrl);
    if (relativePath.endsWith('app.js')) console.log(`[BUILD] Replaced API_BASE_URL with ${apiBaseUrl} in ${relativePath}`);

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
    const apiBaseUrl = process.env.WORKER_URL || 'https://site-blogs.iamjeesun.workers.dev';

    if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        content = content.replace(/__CLERK_PUBLISHABLE_KEY__/g, process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
        console.log('[BUILD] Replaced Clerk Publishable Key in wrangler.toml');
    }
    if (process.env.CLERK_SECRET_KEY) {
        content = content.replace(/__CLERK_SECRET_KEY__/g, process.env.CLERK_SECRET_KEY);
        console.log('[BUILD] Replaced Clerk Secret Key in wrangler.toml');
    }

    content = content.replace(/__API_BASE_URL__/g, apiBaseUrl);
    console.log(`[BUILD] Replaced WORKER_URL with ${apiBaseUrl} in wrangler.toml`);

    fs.writeFileSync(wranglerDest, content);
    console.log('Processed wrangler.toml.template -> wrangler.toml');
}

console.log(`Build complete: Files are in ${distPath}`);
