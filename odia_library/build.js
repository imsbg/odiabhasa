const fs = require('fs').promises;
const path = require('path');

// This special 'require' is for the fetch library.
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// --- CONFIGURATION ---
const API_ALL_BOOKS = 'https://sbgb.pages.dev/ବହି/ସବୁ.json';
const BASE_URL = 'https://YOUR_WEBSITE_URL'; // IMPORTANT: We will change this later
const DIST_DIR = path.join(__dirname, 'dist');
const BOOKS_DIR = path.join(DIST_DIR, 'books');
const SOURCE_DIR = path.join(__dirname, 'source');

async function buildSite() {
    console.log('Starting Cloudflare build process...');

    // 1. Clean and create output directories
    await fs.rm(DIST_DIR, { recursive: true, force: true });
    await fs.mkdir(BOOKS_DIR, { recursive: true });

    // 2. Copy static files (index.html, style.css, etc.) from source to dist
    const sourceFiles = await fs.readdir(SOURCE_DIR);
    for (const file of sourceFiles) {
        if (file !== 'templates') { // Don't copy the templates folder itself
             await fs.copyFile(path.join(SOURCE_DIR, file), path.join(DIST_DIR, file));
        }
    }
    console.log('Static files copied.');

    // 3. Load the book template
    const template = await fs.readFile(path.join(SOURCE_DIR, 'templates', 'book_template.html'), 'utf-8');

    // 4. Fetch the list of all books
    const response = await fetch(API_ALL_BOOKS);
    if (!response.ok) {
        throw new Error(`Failed to fetch all books list: ${response.statusText}`);
    }
    const allBooks = await response.json();
    const sitemapEntries = [];

    // 5. Generate a page for each book
    for (const bookInfo of allBooks) {
        try {
            const bookId = bookInfo.destination.split('/').pop().replace('.json', '');
            console.log(`Processing book: ${bookId}`);

            const bookRes = await fetch(bookInfo.destination);
            if (!bookRes.ok) {
                console.warn(`Could not fetch data for ${bookId}. Skipping.`);
                continue;
            }
            const bookData = await bookRes.json();

            // Generate HTML content from the book's JSON data
            let bookContentHtml = '';
            (bookData.pages || []).forEach(page => {
                if (page.content) {
                    page.content.forEach(item => {
                        if (item.type === 'header') bookContentHtml += `<div class="content-header">${item.text}</div>`;
                        if (item.type === 'paragraph') {
                            bookContentHtml += `<div class="content-p">${(item.spans || []).map(s => `<span class="${s.style||''}">${s.text}</span>`).join('')}</div>`;
                        }
                    });
                }
            });

            // Replace placeholders in the template
            const bookUrl = `${BASE_URL}/books/${bookId}.html`;
            const finalHtml = template
                .replace(/__BOOK_TITLE__/g, bookData.title)
                .replace(/__BOOK_AUTHOR__/g, bookData.author)
                .replace(/__BOOK_COVER__/g, bookData.coverpage || 'https://imsbg.github.io/odiabhasa/images/app.png')
                .replace(/__BOOK_URL__/g, bookUrl)
                .replace('__BOOK_CONTENT_HTML__', bookContentHtml);

            await fs.writeFile(path.join(BOOKS_DIR, `${bookId}.html`), finalHtml);
            sitemapEntries.push(bookUrl);
        } catch (error) {
            console.error(`Failed to process book: ${bookInfo.destination}`, error);
        }
    }

    // 6. Generate a sitemap.xml for Google
    await generateSitemap(sitemapEntries);

    console.log('Build complete! Your static site is in the /dist folder.');
}

async function generateSitemap(urls) {
    console.log('Generating sitemap.xml...');
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>${BASE_URL}/index.html</loc></url>
    ${urls.map(url => `<url><loc>${url}</loc></url>`).join('\n')}
</urlset>`;
    await fs.writeFile(path.join(DIST_DIR, 'sitemap.xml'), sitemapContent.trim());
    console.log('Sitemap generated!');
}

buildSite();
