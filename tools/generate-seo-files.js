const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');
const dataFile = path.join(rootDir, 'assets', 'js', 'data.js');
const robotsFile = path.join(rootDir, 'robots.txt');
const sitemapFile = path.join(rootDir, 'sitemap.xml');

function loadVisaData() {
    const source = fs.readFileSync(dataFile, 'utf8');
    const context = {};
    vm.createContext(context);
    vm.runInContext(`${source}\nthis.__visaData = visaData;`, context);
    return context.__visaData;
}

function escapeXml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function buildAbsoluteUrl(siteUrl, relativePath) {
    return new URL(relativePath, `${siteUrl.replace(/\/+$/, '')}/`).toString();
}

function main() {
    const visaData = loadVisaData();
    const siteUrl = (process.env.SITE_URL || visaData.settings?.siteUrl || '').trim();
    if (!siteUrl) {
        throw new Error('SITE_URL is required. Set visaData.settings.siteUrl or pass SITE_URL in the environment.');
    }
    const lastMod = new Date().toISOString().slice(0, 10);

    const staticPages = [
        '',
        'visas.html',
        'about.html',
        'enquiry.html',
        'international-driving-license.html',
        'privacy.html',
        'terms.html'
    ];

    const countryPages = (visaData.countries || []).map(country => `country.html?code=${encodeURIComponent(country.slug)}`);
    const urls = [...staticPages, ...countryPages];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(relativePath => `  <url>\n    <loc>${escapeXml(buildAbsoluteUrl(siteUrl, relativePath))}</loc>\n    <lastmod>${lastMod}</lastmod>\n  </url>`).join('\n')}\n</urlset>\n`;

    const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${buildAbsoluteUrl(siteUrl, 'sitemap.xml')}\n`;

    fs.writeFileSync(sitemapFile, sitemapXml, 'utf8');
    fs.writeFileSync(robotsFile, robotsTxt, 'utf8');
    console.log(`Generated ${path.basename(sitemapFile)} and ${path.basename(robotsFile)} for ${siteUrl}`);
}

main();
