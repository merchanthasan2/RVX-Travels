const fs = require('fs');
const path = require('path');

const dataJsPath = path.join(__dirname, 'assets', 'js', 'data.js');
let dataContent = fs.readFileSync(dataJsPath, 'utf8');

const https = require('https');
const imgDir = path.join(__dirname, 'assets', 'images', 'countries');

if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
}

function download(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
                return download(res.headers.location, filepath).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                return reject(new Error('Failed to get ' + url + ' status ' + res.statusCode));
            }
            const file = fs.createWriteStream(filepath);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => {});
            reject(err);
        });
    });
}

async function run() {
    let lines = dataContent.split('\n');
    let currentSlug = null;
    let downloads = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        const slugMatch = line.match(/slug:\s*"([^"]+)"/);
        if (slugMatch) {
            currentSlug = slugMatch[1];
        }
        
        const heroMatch = line.match(/heroImage:\s*"([^"]+)"/);
        if (currentSlug && heroMatch && heroMatch[1].startsWith('http')) {
            downloads.push({ slug: currentSlug, type: 'hero', url: heroMatch[1] });
        }
        
        const cardMatch = line.match(/cardImage:\s*"([^"]+)"/);
        if (currentSlug && cardMatch && cardMatch[1].startsWith('http')) {
            downloads.push({ slug: currentSlug, type: 'card', url: cardMatch[1] });
        }
    }
    
    console.log(`Found ${downloads.length} images to download.`);
    for (const d of downloads) {
        const ext = '.jpg';
        const filename = `${d.slug}-${d.type}${ext}`;
        const filepath = path.join(imgDir, filename);
        if (!fs.existsSync(filepath)) {
            console.log(`Downloading ${d.slug} ${d.type}...`);
            try {
                await download(d.url, filepath);
            } catch(e) {
                console.error(`Error downloading ${d.url}`, e);
            }
        }
    }
    console.log("Done downloading.");
}

run();
