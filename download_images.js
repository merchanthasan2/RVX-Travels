const fs = require('fs');
const https = require('https');
const path = require('path');

const dataFile = require('./assets/js/data_script_input.json');

const imgDir = path.join(__dirname, 'assets', 'images', 'countries');

if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
}

function download(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
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
    console.log("Starting downloads...");
    let changed = false;
    for (const country of dataFile) {
        if (country.heroImage && country.heroImage.startsWith('http')) {
            const ext = '.jpg';
            const filename = `${country.slug}-hero${ext}`;
            const filepath = path.join(imgDir, filename);
            console.log(`Downloading ${country.name} hero...`);
            try {
                await download(country.heroImage, filepath);
            } catch (e) {
                console.error("Error dl", e);
            }
        }
        if (country.cardImage && country.cardImage.startsWith('http')) {
            const ext = '.jpg';
            const filename = `${country.slug}-card${ext}`;
            const filepath = path.join(imgDir, filename);
            console.log(`Downloading ${country.name} card...`);
            try {
                await download(country.cardImage, filepath);
            } catch (e) {
                console.error("Error dl", e);
            }
        }
    }
    console.log("Done.");
}

run();
