const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');
const dataJsPath = path.join(rootDir, 'assets', 'js', 'data.js');
const mainJsPath = path.join(rootDir, 'assets', 'js', 'main.js');
const imageDir = path.join(rootDir, 'assets', 'images', 'countries');

function loadVisaData() {
    const source = fs.readFileSync(dataJsPath, 'utf8');
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(`${source};this.__visaData = visaData;`, sandbox);
    return sandbox.__visaData;
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function createDocumentStub() {
    return {
        addEventListener() {},
        removeEventListener() {},
        querySelectorAll() { return []; },
        querySelector() { return null; },
        getElementById() { return null; },
        createElement() { return { style: {}, setAttribute() {}, appendChild() {} }; },
        head: { appendChild() {} },
        body: { classList: { add() {}, remove() {} } }
    };
}

function createWindowStub() {
    return {
        location: { href: '' },
        addEventListener() {},
        removeEventListener() {},
        setTimeout(handler) {
            if (typeof handler === 'function') {
                handler();
            }
            return 1;
        },
        clearTimeout() {}
    };
}

function loadMainJsSandbox() {
    const imageOutcomes = new Map();

    class FakeImage {
        constructor() {
            this.onload = null;
            this.onerror = null;
        }

        set src(value) {
            this._src = value;
            queueMicrotask(() => {
                const outcome = imageOutcomes.get(value) || 'error';
                if (outcome === 'load') {
                    if (typeof this.onload === 'function') this.onload();
                    return;
                }

                if (typeof this.onerror === 'function') this.onerror(new Error(`Failed to load ${value}`));
            });
        }

        get src() {
            return this._src;
        }
    }

    const sandbox = {
        console,
        queueMicrotask,
        document: createDocumentStub(),
        window: createWindowStub(),
        navigator: {},
        lucide: { createIcons() {} },
        fetch: async () => ({ ok: true, json: async () => ({}) }),
        URLSearchParams,
        Image: FakeImage
    };

    vm.createContext(sandbox);
    const mainSource = fs.readFileSync(mainJsPath, 'utf8');
    vm.runInContext(mainSource, sandbox);

    return { sandbox, imageOutcomes };
}

function createFakeImgElement(initialSrc = '') {
    const listeners = {};
    let currentSrc = initialSrc;

    return {
        isConnected: true,
        addEventListener(type, handler) {
            listeners[type] = handler;
        },
        trigger(type) {
            if (listeners[type]) {
                listeners[type]();
            }
        },
        set src(value) {
            currentSrc = value;
        },
        get src() {
            return currentSrc;
        }
    };
}

async function verifyFallbackBehavior(country) {
    const { sandbox, imageOutcomes } = loadMainJsSandbox();

    const cardImg = createFakeImgElement();
    sandbox.hydrateCountryCardImage(cardImg, country);
    assert(cardImg.src === country.cardImage, 'Card fallback should start with the primary card image.');
    cardImg.trigger('error');
    assert(cardImg.src === country.cardImageBackup, 'Card fallback should move to the backup card image after a failure.');
    cardImg.trigger('error');
    assert(cardImg.src.startsWith('data:image/svg+xml'), 'Card fallback should end on the placeholder after both local images fail.');

    imageOutcomes.set(country.heroImage, 'error');
    imageOutcomes.set(country.heroImageBackup, 'load');

    const heroElement = { style: {} };
    await sandbox.applyCountryBackgroundImage(heroElement, country, 'var(--gradient-hero)');
    assert(
        heroElement.style.backgroundImage.includes(country.heroImageBackup),
        'Hero fallback should use the backup hero image after the primary fails.'
    );

    imageOutcomes.set(country.heroImage, 'error');
    imageOutcomes.set(country.heroImageBackup, 'error');

    const placeholderElement = { style: {} };
    await sandbox.applyCountryBackgroundImage(placeholderElement, country, 'var(--gradient-hero)');
    assert(
        placeholderElement.style.backgroundImage.includes('data:image/svg+xml'),
        'Hero fallback should end on the placeholder after both hero images fail.'
    );
}

async function main() {
    const visaData = loadVisaData();
    const missingFiles = [];
    const remoteRefs = [];

    for (const country of visaData.countries) {
        for (const field of ['heroImage', 'heroImageBackup', 'cardImage', 'cardImageBackup']) {
            const value = country[field];
            if (/^https?:\/\//i.test(String(value || ''))) {
                remoteRefs.push(`${country.slug}.${field}`);
                continue;
            }

            const filePath = path.join(rootDir, value);
            if (!fs.existsSync(filePath)) {
                missingFiles.push(filePath);
            }
        }
    }

    assert(remoteRefs.length === 0, `Remote image references remain in data.js: ${remoteRefs.join(', ')}`);
    assert(missingFiles.length === 0, `Missing image files:\n${missingFiles.join('\n')}`);

    const imageFiles = fs.readdirSync(imageDir).filter((name) => /\.(jpg|jpeg|png|webp)$/i.test(name));
    assert(imageFiles.length === visaData.countries.length * 4, 'Country image inventory is incomplete.');

    await verifyFallbackBehavior(visaData.countries[0]);

    console.log(JSON.stringify({
        countries: visaData.countries.length,
        localImageFiles: imageFiles.length,
        verification: 'passed'
    }, null, 2));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
