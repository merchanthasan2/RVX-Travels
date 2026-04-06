const fs = require('fs');

const dataPath = 'd:/Vibe Code/Royal Visa Xpert/assets/js/data.js';
let content = fs.readFileSync(dataPath, 'utf8');

const schengenCountries = [
    { name: "Austria", slug: "austria", capital: "Vienna", iso2: "AT", language: "German", hero: "https://images.unsplash.com/photo-1516550893923-42d28e5677af" },
    { name: "Belgium", slug: "belgium", capital: "Brussels", iso2: "BE", language: "Dutch, French, German", hero: "https://images.unsplash.com/photo-1552554706-71408846c4f0" },
    { name: "France", slug: "france", capital: "Paris", iso2: "FR", language: "French", hero: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", recommended: true },
    { name: "Germany", slug: "germany", capital: "Berlin", iso2: "DE", language: "German", hero: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b", recommended: true },
    { name: "Luxembourg", slug: "luxembourg", capital: "Luxembourg City", iso2: "LU", language: "Luxembourgish, French, German", hero: "https://images.unsplash.com/photo-1512413149504-2f2f01f0edeb" },
    { name: "Netherlands", slug: "netherlands", capital: "Amsterdam", iso2: "NL", language: "Dutch", hero: "https://images.unsplash.com/photo-1512470876302-972fad2aa9dd", recommended: true },
    { name: "Croatia", slug: "croatia", capital: "Zagreb", iso2: "HR", language: "Croatian", hero: "https://images.unsplash.com/photo-1555990548-356166ae0749" },
    { name: "Greece", slug: "greece", capital: "Athens", iso2: "GR", language: "Greek", hero: "https://images.unsplash.com/photo-1533105079780-92b9be482077", recommended: true },
    { name: "Italy", slug: "italy", capital: "Rome", iso2: "IT", language: "Italian", hero: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9", recommended: true },
    { name: "Malta", slug: "malta", capital: "Valletta", iso2: "MT", language: "Maltese, English", hero: "https://images.unsplash.com/photo-1522083165195-3424ed129620" },
    { name: "Portugal", slug: "portugal", capital: "Lisbon", iso2: "PT", language: "Portuguese", hero: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b" },
    { name: "Spain", slug: "spain", capital: "Madrid", iso2: "ES", language: "Spanish", hero: "https://images.unsplash.com/photo-1543783230-27839841ee5c", recommended: true },
    { name: "Denmark", slug: "denmark", capital: "Copenhagen", iso2: "DK", currency: "DKK (kr)", language: "Danish", hero: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc" },
    { name: "Estonia", slug: "estonia", capital: "Tallinn", iso2: "EE", language: "Estonian", hero: "https://images.unsplash.com/photo-1548433440-622f67602078" },
    { name: "Finland", slug: "finland", capital: "Helsinki", iso2: "FI", language: "Finnish, Swedish", hero: "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5" },
    { name: "Iceland", slug: "iceland", capital: "Reykjavik", iso2: "IS", currency: "ISK (kr)", language: "Icelandic", hero: "https://images.unsplash.com/photo-1504893524553-f85f3bbfe073" },
    { name: "Latvia", slug: "latvia", capital: "Riga", iso2: "LV", language: "Latvian", hero: "https://images.unsplash.com/photo-1563212620-8e104191390d" },
    { name: "Lithuania", slug: "lithuania", capital: "Vilnius", iso2: "LT", language: "Lithuanian", hero: "https://images.unsplash.com/photo-1514334335804-0370f6e1f0e9" },
    { name: "Norway", slug: "norway", capital: "Oslo", iso2: "NO", currency: "NOK (kr)", language: "Norwegian", hero: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38" },
    { name: "Sweden", slug: "sweden", capital: "Stockholm", iso2: "SE", currency: "SEK (kr)", language: "Swedish", hero: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11" },
    { name: "Bulgaria", slug: "bulgaria", capital: "Sofia", iso2: "BG", currency: "BGN (лв)", language: "Bulgarian", hero: "https://images.unsplash.com/photo-1549468057-5b7fa1a41d7a" },
    { name: "Czech Republic", slug: "czech-republic", capital: "Prague", iso2: "CZ", currency: "CZK (Kč)", language: "Czech", hero: "https://images.unsplash.com/photo-1541849546-216549ae216d" },
    { name: "Hungary", slug: "hungary", capital: "Budapest", iso2: "HU", currency: "HUF (Ft)", language: "Hungarian", hero: "https://images.unsplash.com/photo-1551867633-194f0995166f" },
    { name: "Poland", slug: "poland", capital: "Warsaw", iso2: "PL", currency: "PLN (zł)", language: "Polish", hero: "https://images.unsplash.com/photo-1519197924294-4ba991a11128" },
    { name: "Romania", slug: "romania", capital: "Bucharest", iso2: "RO", currency: "RON (lei)", language: "Romanian", hero: "https://images.unsplash.com/photo-1522244451342-a41bf8a13d73" },
    { name: "Slovakia", slug: "slovakia", capital: "Bratislava", iso2: "SK", language: "Slovak", hero: "https://images.unsplash.com/photo-1513233854124-7667d4fdf807" },
    { name: "Slovenia", slug: "slovenia", capital: "Ljubljana", iso2: "SI", language: "Slovenian", hero: "https://images.unsplash.com/photo-1513524558231-6e973e86c0c2" },
    { name: "Liechtenstein", slug: "liechtenstein", capital: "Vaduz", iso2: "LI", currency: "CHF (Fr)", language: "German", hero: "https://images.unsplash.com/photo-1558905391-789a712ebbf3" },
    { name: "Switzerland", slug: "switzerland", capital: "Bern", iso2: "CH", currency: "CHF (Fr)", language: "German, French, Italian, Romansh", hero: "https://images.unsplash.com/photo-1491951931722-5a446214b4e2", recommended: true }
];

const replacement = schengenCountries.map(c => `        {
            slug: "${c.slug}",
            name: "${c.name}",
            capital: "${c.capital}",
            iso2: "${c.iso2}",
            continent: "Europe",
            currency: "${c.currency || 'EUR (€)'}",
            language: "${c.language}",
            recommended: ${c.recommended || false},
            heroImage: "${c.hero}?q=80&w=2000&auto=format&fit=crop",
            cardImage: "${c.hero}?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa allows you to travel freely across all 29 Schengen member countries." }]
        }`).join(",\n");

// regex that identifies the schengen object
const schengenRegex = /\{\n\s+slug: "schengen"[\s\S]*?faqs: \[\{ q: "Single visa\?", a: "Yes, access to 27 countries." \}\]\n\s+\},/m;

if (schengenRegex.test(content)) {
    content = content.replace(schengenRegex, replacement + ',');
    fs.writeFileSync(dataPath, content, 'utf8');
    console.log("Successfully replaced generic schengen entry with 29 countries.");
} else {
    console.log("Could not find the original schengen entry.");
}
