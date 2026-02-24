const fs = require('fs');
const path = require('path');
require('dotenv').config();

const frontendPath = path.join(__dirname, 'frontend');
const distPath = path.join(__dirname, 'dist');

// 1. Create dist directory if it doesn't exist
if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
}

// 2. Helper to copy and replace files
function processFile(filename) {
    const src = path.join(frontendPath, filename);
    const dest = path.join(distPath, filename);

    if (fs.statSync(src).isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(file => processFile(path.join(filename, file)));
        return;
    }

    let content = fs.readFileSync(src, 'utf8');

    // Replace Clerk Publishable Key
    if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        content = content.replace(/__CLERK_PUBLISHABLE_KEY__/g, process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
    }

    fs.writeFileSync(dest, content);
    console.log(`Processed ${filename}`);
}

// 3. Process all files in frontend
fs.readdirSync(frontendPath).forEach(file => processFile(file));

// 4. Process wrangler.toml
const wranglerSrc = path.join(__dirname, 'worker', 'wrangler.toml');
const wranglerDest = path.join(__dirname, 'worker', 'wrangler.toml.processed');

if (fs.existsSync(wranglerSrc)) {
    let content = fs.readFileSync(wranglerSrc, 'utf8');
    if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        content = content.replace(/__CLERK_PUBLISHABLE_KEY__/g, process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
    }
    if (process.env.CLERK_SECRET_KEY) {
        content = content.replace(/__CLERK_SECRET_KEY__/g, process.env.CLERK_SECRET_KEY);
    }
    fs.writeFileSync(wranglerDest, content);
    console.log('Processed wrangler.toml -> wrangler.toml.processed');
}

console.log('Build complete: Files are in /dist and worker/wrangler.toml.processed');
