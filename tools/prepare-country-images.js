const fs = require('fs');
const https = require('https');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');
const dataJsPath = path.join(rootDir, 'assets', 'js', 'data.js');
const manifestPath = path.join(__dirname, 'country-image-sources.json');
const imageDir = path.join(rootDir, 'assets', 'images', 'countries');

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function isHttpUrl(value) {
    return /^https?:\/\//i.test(String(value || ''));
}

function loadVisaData() {
    const source = fs.readFileSync(dataJsPath, 'utf8');
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(`${source};this.__visaData = visaData;`, sandbox);
    return sandbox.__visaData;
}

function loadManifest() {
    if (!fs.existsSync(manifestPath)) {
        return {};
    }

    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function createManifestEntry(country, existingEntry = {}) {
    const heroSource = existingEntry.heroSource || (isHttpUrl(country.heroImage) ? country.heroImage : null);
    const cardSource = existingEntry.cardSource || (isHttpUrl(country.cardImage) ? country.cardImage : null);

    return {
        name: country.name,
        heroSource,
        heroBackupSource: existingEntry.heroBackupSource || cardSource || heroSource,
        cardSource,
        cardBackupSource: existingEntry.cardBackupSource || heroSource || cardSource
    };
}

function writeManifest(manifest) {
    fs.writeFileSync(`${manifestPath}`, `${JSON.stringify(manifest, null, 4)}\n`);
}

function localImagePaths(slug) {
    return {
        heroImage: `assets/images/countries/${slug}-hero.jpg`,
        heroImageBackup: `assets/images/countries/${slug}-hero-backup.jpg`,
        cardImage: `assets/images/countries/${slug}-card.jpg`,
        cardImageBackup: `assets/images/countries/${slug}-card-backup.jpg`
    };
}

function localImageFiles(slug) {
    return {
        heroImage: path.join(imageDir, `${slug}-hero.jpg`),
        heroImageBackup: path.join(imageDir, `${slug}-hero-backup.jpg`),
        cardImage: path.join(imageDir, `${slug}-card.jpg`),
        cardImageBackup: path.join(imageDir, `${slug}-card-backup.jpg`)
    };
}

function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function downloadFile(url, targetPath, attempt = 1) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
            }
        }, (response) => {
            if ([301, 302, 307, 308].includes(response.statusCode) && response.headers.location) {
                response.resume();
                downloadFile(response.headers.location, targetPath, attempt).then(resolve).catch(reject);
                return;
            }

            if ((response.statusCode === 403 || response.statusCode === 429) && attempt < 4) {
                response.resume();
                wait(attempt * 1200)
                    .then(() => downloadFile(url, targetPath, attempt + 1))
                    .then(resolve)
                    .catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                response.resume();
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }

            const contentType = String(response.headers['content-type'] || '').toLowerCase();
            if (!contentType.startsWith('image/')) {
                response.resume();
                reject(new Error(`Unexpected content-type for ${url}: ${contentType || 'unknown'}`));
                return;
            }

            const file = fs.createWriteStream(targetPath);
            response.pipe(file);

            file.on('finish', () => {
                file.close(() => {
                    const stat = fs.statSync(targetPath);
                    if (stat.size <= 0) {
                        fs.unlinkSync(targetPath);
                        reject(new Error(`Downloaded empty file for ${url}`));
                        return;
                    }

                    resolve();
                });
            });

            file.on('error', (error) => {
                file.close(() => {
                    if (fs.existsSync(targetPath)) {
                        fs.unlinkSync(targetPath);
                    }
                    reject(error);
                });
            });
        });

        request.on('error', (error) => {
            if (fs.existsSync(targetPath)) {
                fs.unlinkSync(targetPath);
            }
            reject(error);
        });
    });
}

async function ensurePrimaryAsset(filePath, sourceUrl) {
    if (fs.existsSync(filePath)) {
        return 'existing';
    }

    if (!isHttpUrl(sourceUrl)) {
        throw new Error(`Missing source URL for ${path.basename(filePath)}`);
    }

    await downloadFile(sourceUrl, filePath);
    return 'downloaded';
}

function copyLocalAsset(targetPath, sourcePath) {
    if (fs.existsSync(targetPath)) {
        return 'existing';
    }

    if (!sourcePath || !fs.existsSync(sourcePath)) {
        throw new Error(`Cannot copy ${path.basename(targetPath)} because ${path.basename(sourcePath || '')} is missing.`);
    }

    fs.copyFileSync(sourcePath, targetPath);
    return 'copied';
}

function ensureBackupAsset(targetPath, preferredSourcePath, sourceUrl) {
    if (fs.existsSync(targetPath)) {
        return 'existing';
    }

    if (preferredSourcePath && fs.existsSync(preferredSourcePath)) {
        fs.copyFileSync(preferredSourcePath, targetPath);
        return 'copied';
    }

    if (!isHttpUrl(sourceUrl)) {
        throw new Error(`Missing backup source URL for ${path.basename(targetPath)}`);
    }

    return downloadFile(sourceUrl, targetPath).then(() => 'downloaded');
}

function rewriteDataFile(visaData) {
    const nextData = {
        ...visaData,
        countries: visaData.countries.map((country) => ({
            ...country,
            ...localImagePaths(country.slug)
        }))
    };

    const output = `const visaData = ${JSON.stringify(nextData, null, 4)};\n`;
    fs.writeFileSync(dataJsPath, output);
}

async function main() {
    ensureDir(imageDir);

    const visaData = loadVisaData();
    const existingManifest = loadManifest();
    const manifest = {};
    const counters = {
        downloaded: 0,
        copied: 0,
        existing: 0
    };

    for (const country of visaData.countries) {
        manifest[country.slug] = createManifestEntry(country, existingManifest[country.slug]);
    }

    writeManifest(manifest);

    for (const country of visaData.countries) {
        const files = localImageFiles(country.slug);
        const entry = manifest[country.slug];

        if (!fs.existsSync(files.heroImage) && !fs.existsSync(files.cardImage)) {
            if (isHttpUrl(entry.heroSource)) {
                counters[await ensurePrimaryAsset(files.heroImage, entry.heroSource)] += 1;
            } else {
                counters[await ensurePrimaryAsset(files.cardImage, entry.cardSource)] += 1;
            }
        }

        if (!fs.existsSync(files.heroImage)) {
            counters[copyLocalAsset(files.heroImage, files.cardImage)] += 1;
        }

        if (!fs.existsSync(files.cardImage)) {
            counters[copyLocalAsset(files.cardImage, files.heroImage)] += 1;
        }

        counters[await ensureBackupAsset(files.heroImageBackup, files.cardImage, entry.heroBackupSource)] += 1;
        counters[await ensureBackupAsset(files.cardImageBackup, files.heroImage, entry.cardBackupSource)] += 1;
    }

    rewriteDataFile(visaData);

    console.log(JSON.stringify({
        countries: visaData.countries.length,
        manifestPath,
        imageDir,
        counters
    }, null, 2));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
