const fs = require('fs');
const path = require('path');

const dataJsPath = path.join(__dirname, 'assets', 'js', 'data.js');
let dataContent = fs.readFileSync(dataJsPath, 'utf8');

const regexIter = /"(slug)":\s*"([^"]+)"[\s\S]*?"(heroImage|cardImage)":\s*"([^"]+)"[\s\S]*?"(heroImage|cardImage)":\s*"([^"]+)"/g;
// Actually a simpler approach:
// Replace all `heroImage: "http...",` and `cardImage: "http...",` with local paths.
// Let's do it with a string replace step-by-step
const slugRegex = /slug:\s*"([^"]+)"/g;
let slugs = [];
let match;
while ((match = slugRegex.exec(dataContent)) !== null) {
    slugs.push(match[1]);
}

for (const slug of slugs) {
    // We want to find the object block for this slug, and replace its heroImage and cardImage.
    // It's safer to just do a regex replace on the specific object, but simple global replace works if all are uniform.
    // Actually, dataContent.replace(/heroImage: "https?[^"]+",/g, ...)? No, we need the slug to know the filename.
}

// Let's do it row by row. Each object has `slug: "some-slug",` then `heroImage: "url",` then `cardImage: "url",`.
let inObject = false;
let currentSlug = null;
let lines = dataContent.split('\n');
for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const slugMatch = line.match(/slug:\s*"([^"]+)"/);
    if (slugMatch) {
        currentSlug = slugMatch[1];
    }
    if (currentSlug && line.match(/heroImage:\s*"http[^"]+"/)) {
        lines[i] = line.replace(/heroImage:\s*"http[^"]+"/, `heroImage: "assets/images/countries/${currentSlug}-hero.jpg"`);
    }
    if (currentSlug && line.match(/cardImage:\s*"http[^"]+"/)) {
        lines[i] = line.replace(/cardImage:\s*"http[^"]+"/, `cardImage: "assets/images/countries/${currentSlug}-card.jpg"`);
    }
}

fs.writeFileSync(dataJsPath, lines.join('\n'));
console.log("Updated data.js with local image paths.");
