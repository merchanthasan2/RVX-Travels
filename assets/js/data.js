const visaData = {
    countries: [
        {
            slug: "united-states",
            name: "United States",
            capital: "Washington, D.C.",
            iso2: "US",
            continent: "Americas",
            currency: "USD ($)",
            language: "English",
            recommended: true,
            heroImage: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=800&auto=format&fit=crop",
            population: 339996563,
            seasonTips: ["Mar–May", "Sep–Nov"],
            topAttractions: [
                { name: "Grand Canyon", blurb: "Epic vistas and hiking" },
                { name: "Statue of Liberty", blurb: "Iconic landmark" },
                { name: "Yellowstone", blurb: "Geysers and wildlife" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [
                { q: "How early should I apply?", a: "Ideally 4–6 weeks before travel." }
            ]
        },
        {
            slug: "united-kingdom",
            name: "United Kingdom",
            capital: "London",
            iso2: "GB",
            continent: "Europe",
            currency: "GBP (£)",
            language: "English",
            recommended: true,
            heroImage: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop",
            population: 67000000,
            seasonTips: ["May–Sep", "Dec (Christmas)"],
            topAttractions: [
                { name: "Tower Bridge", blurb: "Iconic Victorian bridge" },
                { name: "British Museum", blurb: "World history and culture" },
                { name: "Stonehenge", blurb: "Prehistoric monument" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [
                { q: "Is the visa process difficult?", a: "It requires detailed documentation but we simplify it for you." }
            ]
        },
        {
            slug: "canada",
            name: "Canada",
            capital: "Ottawa",
            iso2: "CA",
            continent: "Americas",
            currency: "CAD ($)",
            language: "English, French",
            recommended: true,
            heroImage: "https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=800&auto=format&fit=crop",
            population: 38000000,
            seasonTips: ["Jun–Aug", "Sep–Oct"],
            topAttractions: [
                { name: "Niagara Falls", blurb: "Majestic waterfalls" },
                { name: "Banff National Park", blurb: "Rocky Mountain beauty" },
                { name: "CN Tower", blurb: "Toronto skyline view" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [
                { q: "Is biometrics required?", a: "Yes, most applicants need to provide biometrics." }
            ]
        },
        {
            slug: "austria",
            name: "Austria",
            capital: "Vienna",
            iso2: "AT",
            continent: "Europe",
            currency: "EUR (€)",
            language: "German",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "belgium",
            name: "Belgium",
            capital: "Brussels",
            iso2: "BE",
            continent: "Europe",
            currency: "EUR (€)",
            language: "Dutch, French, German",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1552554706-71408846c4f0?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1552554706-71408846c4f0?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "france",
            name: "France",
            capital: "Paris",
            iso2: "FR",
            continent: "Europe",
            currency: "EUR (€)",
            language: "French",
            recommended: true,
            heroImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "germany",
            name: "Germany",
            capital: "Berlin",
            iso2: "DE",
            continent: "Europe",
            currency: "EUR (€)",
            language: "German",
            recommended: true,
            heroImage: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "luxembourg",
            name: "Luxembourg",
            capital: "Luxembourg City",
            iso2: "LU",
            continent: "Europe",
            currency: "EUR (€)",
            language: "Luxembourgish, French, German",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1512413149504-2f2f01f0edeb?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1512413149504-2f2f01f0edeb?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "netherlands",
            name: "Netherlands",
            capital: "Amsterdam",
            iso2: "NL",
            continent: "Europe",
            currency: "EUR (€)",
            language: "Dutch",
            recommended: true,
            heroImage: "https://images.unsplash.com/photo-1512470876302-972fad2aa9dd?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1512470876302-972fad2aa9dd?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "croatia",
            name: "Croatia",
            capital: "Zagreb",
            iso2: "HR",
            continent: "Europe",
            currency: "EUR (€)",
            language: "Croatian",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1555990548-356166ae0749?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1555990548-356166ae0749?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "greece",
            name: "Greece",
            capital: "Athens",
            iso2: "GR",
            continent: "Europe",
            currency: "EUR (€)",
            language: "Greek",
            recommended: true,
            heroImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "italy",
            name: "Italy",
            capital: "Rome",
            iso2: "IT",
            continent: "Europe",
            currency: "EUR (€)",
            language: "Italian",
            recommended: true,
            heroImage: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "malta",
            name: "Malta",
            capital: "Valletta",
            iso2: "MT",
            continent: "Europe",
            currency: "EUR (€)",
            language: "Maltese, English",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1522083165195-3424ed129620?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1522083165195-3424ed129620?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "portugal",
            name: "Portugal",
            capital: "Lisbon",
            iso2: "PT",
            continent: "Europe",
            currency: "EUR (€)",
            language: "Portuguese",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "spain",
            name: "Spain",
            capital: "Madrid",
            iso2: "ES",
            continent: "Europe",
            currency: "EUR (€)",
            language: "Spanish",
            recommended: true,
            heroImage: "https://images.unsplash.com/photo-1543783230-27839841ee5c?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1543783230-27839841ee5c?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "denmark",
            name: "Denmark",
            capital: "Copenhagen",
            iso2: "DK",
            continent: "Europe",
            currency: "DKK (kr)",
            language: "Danish",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "estonia",
            name: "Estonia",
            capital: "Tallinn",
            iso2: "EE",
            continent: "Europe",
            currency: "EUR (€)",
            language: "Estonian",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1548433440-622f67602078?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1548433440-622f67602078?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "finland",
            name: "Finland",
            capital: "Helsinki",
            iso2: "FI",
            continent: "Europe",
            currency: "EUR (€)",
            language: "Finnish, Swedish",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "iceland",
            name: "Iceland",
            capital: "Reykjavik",
            iso2: "IS",
            continent: "Europe",
            currency: "ISK (kr)",
            language: "Icelandic",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1504893524553-f85f3bbfe073?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1504893524553-f85f3bbfe073?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "latvia",
            name: "Latvia",
            capital: "Riga",
            iso2: "LV",
            continent: "Europe",
            currency: "EUR (€)",
            language: "Latvian",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1563212620-8e104191390d?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1563212620-8e104191390d?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "lithuania",
            name: "Lithuania",
            capital: "Vilnius",
            iso2: "LT",
            continent: "Europe",
            currency: "EUR (€)",
            language: "Lithuanian",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1514334335804-0370f6e1f0e9?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1514334335804-0370f6e1f0e9?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "norway",
            name: "Norway",
            capital: "Oslo",
            iso2: "NO",
            continent: "Europe",
            currency: "NOK (kr)",
            language: "Norwegian",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "sweden",
            name: "Sweden",
            capital: "Stockholm",
            iso2: "SE",
            continent: "Europe",
            currency: "SEK (kr)",
            language: "Swedish",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "bulgaria",
            name: "Bulgaria",
            capital: "Sofia",
            iso2: "BG",
            continent: "Europe",
            currency: "BGN (лв)",
            language: "Bulgarian",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1549468057-5b7fa1a41d7a?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1549468057-5b7fa1a41d7a?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "czech-republic",
            name: "Czech Republic",
            capital: "Prague",
            iso2: "CZ",
            continent: "Europe",
            currency: "CZK (Kč)",
            language: "Czech",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1541849546-216549ae216d?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1541849546-216549ae216d?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "hungary",
            name: "Hungary",
            capital: "Budapest",
            iso2: "HU",
            continent: "Europe",
            currency: "HUF (Ft)",
            language: "Hungarian",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1551867633-194f0995166f?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1551867633-194f0995166f?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "poland",
            name: "Poland",
            capital: "Warsaw",
            iso2: "PL",
            continent: "Europe",
            currency: "PLN (zł)",
            language: "Polish",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1519197924294-4ba991a11128?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1519197924294-4ba991a11128?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "romania",
            name: "Romania",
            capital: "Bucharest",
            iso2: "RO",
            continent: "Europe",
            currency: "RON (lei)",
            language: "Romanian",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1522244451342-a41bf8a13d73?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1522244451342-a41bf8a13d73?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "slovakia",
            name: "Slovakia",
            capital: "Bratislava",
            iso2: "SK",
            continent: "Europe",
            currency: "EUR (€)",
            language: "Slovak",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1513233854124-7667d4fdf807?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1513233854124-7667d4fdf807?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "slovenia",
            name: "Slovenia",
            capital: "Ljubljana",
            iso2: "SI",
            continent: "Europe",
            currency: "EUR (€)",
            language: "Slovenian",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1513524558231-6e973e86c0c2?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1513524558231-6e973e86c0c2?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "liechtenstein",
            name: "Liechtenstein",
            capital: "Vaduz",
            iso2: "LI",
            continent: "Europe",
            currency: "CHF (Fr)",
            language: "German",
            recommended: false,
            heroImage: "https://images.unsplash.com/photo-1558905391-789a712ebbf3?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1558905391-789a712ebbf3?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "switzerland",
            name: "Switzerland",
            capital: "Bern",
            iso2: "CH",
            continent: "Europe",
            currency: "CHF (Fr)",
            language: "German, French, Italian, Romansh",
            recommended: true,
            heroImage: "https://images.unsplash.com/photo-1491951931722-5a446214b4e2?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1491951931722-5a446214b4e2?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Apr-Oct"],
            topAttractions: [
                { name: "City Sightseeing", blurb: "Explore historic architecture and culture." },
                { name: "Museum Visits", blurb: "World-class art and history." },
                { name: "Local Cuisine", blurb: "Try traditional dishes and modern gastronomy." }
            ],
            visaNotes: ["Schengen Visa", "Tourist", "Business"],
            faqs: [{ q: "What is a Schengen Visa?", a: "This visa is required for this country, which allows you to travel freely across all 29 Schengen member countries." }]
        },
        {
            slug: "australia",
            name: "Australia",
            capital: "Canberra",
            iso2: "AU",
            continent: "Oceania",
            currency: "AUD ($)",
            language: "English",
            recommended: true,
            heroImage: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=800&auto=format&fit=crop",
            population: 26000000,
            seasonTips: ["Sep–Nov", "Mar–May"],
            topAttractions: [
                { name: "Sydney Opera House", blurb: "Architectural icon" },
                { name: "Great Barrier Reef", blurb: "Marine wonder" },
                { name: "Uluru", blurb: "Sacred red rock" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [
                { q: "How long does it take?", a: "Processing times vary, usually 2-4 weeks." }
            ]
        },
        {
            slug: "new-zealand",
            name: "New Zealand",
            capital: "Wellington",
            iso2: "NZ",
            continent: "Oceania",
            currency: "NZD ($)",
            language: "English, Māori",
            heroImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Dec–Feb"],
            topAttractions: [
                { name: "Milford Sound", blurb: "Fjord beauty" },
                { name: "Hobbiton", blurb: "Movie set" },
                { name: "Rotorua", blurb: "Geothermal activity" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [{ q: "Processing time?", a: "Around 20-30 days." }]
        },
        {
            slug: "japan",
            name: "Japan",
            capital: "Tokyo",
            iso2: "JP",
            continent: "Asia",
            currency: "JPY (¥)",
            language: "Japanese",
            heroImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
            population: 125000000,
            seasonTips: ["Mar–May (Cherry Blossom)", "Oct–Nov"],
            topAttractions: [
                { name: "Mount Fuji", blurb: "Sacred volcano" },
                { name: "Kyoto Temples", blurb: "Traditional culture" },
                { name: "Shibuya Crossing", blurb: "Bustling city life" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [
                { q: "Do I need a visa?", a: "Indian citizens need a visa, but e-visa options are available for some." }
            ]
        },
        {
            slug: "china",
            name: "China",
            capital: "Beijing",
            iso2: "CN",
            continent: "Asia",
            currency: "CNY (¥)",
            language: "Mandarin",
            heroImage: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=800&auto=format&fit=crop",
            population: 1400000000,
            seasonTips: ["Apr–May", "Sep–Oct"],
            topAttractions: [
                { name: "Great Wall", blurb: "Ancient fortification" },
                { name: "Forbidden City", blurb: "Imperial palace" },
                { name: "Terracotta Army", blurb: "Archaeological site" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [
                { q: "Is biometrics needed?", a: "Yes, you will likely need to visit a visa center." }
            ]
        },
        {
            slug: "thailand",
            name: "Thailand",
            capital: "Bangkok",
            iso2: "TH",
            continent: "Asia",
            currency: "THB (฿)",
            language: "Thai",
            heroImage: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=800&auto=format&fit=crop",
            population: 71000000,
            seasonTips: ["Nov–Feb"],
            topAttractions: [
                { name: "Grand Palace", blurb: "Royal residence" },
                { name: "Phi Phi Islands", blurb: "Tropical paradise" },
                { name: "Chiang Mai", blurb: "Temples and mountains" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [
                { q: "Is visa on arrival available?", a: "Yes, for many nationalities including Indians." }
            ]
        },
        {
            slug: "vietnam",
            name: "Vietnam",
            capital: "Hanoi",
            iso2: "VN",
            continent: "Asia",
            currency: "VND (₫)",
            language: "Vietnamese",
            heroImage: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800&auto=format&fit=crop",
            population: 98000000,
            seasonTips: ["Nov–Apr"],
            topAttractions: [
                { name: "Ha Long Bay", blurb: "Emerald waters" },
                { name: "Hoi An", blurb: "Ancient town" },
                { name: "Ho Chi Minh City", blurb: "Bustling metropolis" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [
                { q: "Is E-Visa available?", a: "Yes, Vietnam offers a convenient E-Visa for many countries." }
            ]
        },
        {
            slug: "singapore",
            name: "Singapore",
            capital: "Singapore",
            iso2: "SG",
            continent: "Asia",
            currency: "SGD ($)",
            language: "English, Malay, Tamil, Mandarin",
            heroImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800&auto=format&fit=crop",
            population: 5600000,
            seasonTips: ["Feb–Apr", "Jul–Sep"],
            topAttractions: [
                { name: "Marina Bay Sands", blurb: "Iconic hotel & pool" },
                { name: "Gardens by the Bay", blurb: "Futuristic park" },
                { name: "Sentosa Island", blurb: "Fun and beaches" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [
                { q: "Is it a paper visa?", a: "It is an e-visa process, very convenient." }
            ]
        },
        {
            slug: "united-arab-emirates",
            name: "United Arab Emirates",
            capital: "Abu Dhabi",
            iso2: "AE",
            continent: "Asia",
            currency: "AED (د.إ)",
            language: "Arabic, English",
            heroImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop",
            population: 9400000,
            seasonTips: ["Nov–Mar"],
            topAttractions: [
                { name: "Burj Khalifa", blurb: "Tallest building in the world" },
                { name: "Sheikh Zayed Mosque", blurb: "Architectural masterpiece" },
                { name: "Desert Safari", blurb: "Dune bashing and culture" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [
                { q: "Is it fast to get a visa?", a: "Yes, UAE visas are typically processed very quickly (2-3 days)." }
            ]
        },
        {
            slug: "turkey",
            name: "Turkey",
            capital: "Ankara",
            iso2: "TR",
            continent: "Europe",
            currency: "TRY (₺)",
            language: "Turkish",
            heroImage: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop",
            population: 85000000,
            seasonTips: ["Apr–May", "Sep–Oct"],
            topAttractions: [
                { name: "Hagia Sophia", blurb: "Historic mosque" },
                { name: "Cappadocia", blurb: "Hot air balloons" },
                { name: "Pamukkale", blurb: "Thermal pools" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [
                { q: "Is E-Visa available?", a: "Yes, Turkey has a very efficient E-Visa system." }
            ]
        },
        {
            slug: "egypt",
            name: "Egypt",
            capital: "Cairo",
            iso2: "EG",
            continent: "Africa",
            currency: "EGP (£)",
            language: "Arabic",
            heroImage: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=800&auto=format&fit=crop",
            population: 104000000,
            seasonTips: ["Oct–Apr"],
            topAttractions: [
                { name: "Pyramids of Giza", blurb: "Ancient wonders" },
                { name: "Nile Cruise", blurb: "River journey" },
                { name: "Valley of the Kings", blurb: "Royal tombs" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [
                { q: "Can I get visa on arrival?", a: "Yes, for many nationalities at major airports." }
            ]
        },
        {
            slug: "south-africa",
            name: "South Africa",
            capital: "Pretoria",
            iso2: "ZA",
            continent: "Africa",
            currency: "ZAR (R)",
            language: "English, Afrikaans, Zulu",
            heroImage: "https://images.unsplash.com/photo-1484318571209-661cf29a69c3?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1484318571209-661cf29a69c3?q=80&w=800&auto=format&fit=crop",
            population: 60000000,
            seasonTips: ["May–Sep (Safari)", "Nov–Mar (Cape)"],
            topAttractions: [
                { name: "Kruger National Park", blurb: "Big 5 safari" },
                { name: "Table Mountain", blurb: "Flat-topped mountain" },
                { name: "Cape Winelands", blurb: "Vineyards and scenery" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [
                { q: "Is yellow fever vax needed?", a: "Only if traveling from a yellow fever zone." }
            ]
        },
        {
            slug: "indonesia",
            name: "Indonesia",
            capital: "Jakarta",
            iso2: "ID",
            continent: "Asia",
            currency: "IDR (Rp)",
            language: "Indonesian",
            heroImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop",
            population: 276000000,
            seasonTips: ["Apr–Oct"],
            topAttractions: [
                { name: "Bali", blurb: "Island paradise" },
                { name: "Borobudur", blurb: "Ancient temple" },
                { name: "Komodo Island", blurb: "Dragons" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [{ q: "Visa on arrival?", a: "Yes, for many nationals." }]
        },
        {
            slug: "sri-lanka",
            name: "Sri Lanka",
            capital: "Colombo",
            iso2: "LK",
            continent: "Asia",
            currency: "LKR (Rs)",
            language: "Sinhala, Tamil",
            heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
            population: 22000000,
            seasonTips: ["Dec–Mar"],
            topAttractions: [
                { name: "Sigiriya", blurb: "Lion Rock" },
                { name: "Ella", blurb: "Hill country" },
                { name: "Mirissa", blurb: "Beaches" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [{ q: "ETA required?", a: "Yes, online ETA needed." }]
        },
        {
            slug: "south-korea",
            name: "South Korea",
            capital: "Seoul",
            iso2: "KR",
            continent: "Asia",
            currency: "KRW (₩)",
            language: "Korean",
            heroImage: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=800&auto=format&fit=crop",
            population: 51000000,
            seasonTips: ["Mar–May", "Sep–Nov"],
            topAttractions: [
                { name: "Gyeongbokgung", blurb: "Royal palace" },
                { name: "Nami Island", blurb: "Scenic nature" },
                { name: "Jeju Island", blurb: "Volcanic island" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [{ q: "K-ETA?", a: "Required for visa-free entry." }]
        },
        {
            slug: "oman",
            name: "Oman",
            capital: "Muscat",
            iso2: "OM",
            continent: "Asia",
            currency: "OMR (ر.ع.)",
            language: "Arabic",
            heroImage: "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?q=80&w=800&auto=format&fit=crop",
            population: 5000000,
            seasonTips: ["Oct–Mar"],
            topAttractions: [
                { name: "Sultan Qaboos Mosque", blurb: "Grand architecture" },
                { name: "Wadi Shab", blurb: "Canyon swim" },
                { name: "Wahiba Sands", blurb: "Desert dunes" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [{ q: "E-visa?", a: "Yes, simple online application." }]
        },
        {
            slug: "azerbaijan",
            name: "Azerbaijan",
            capital: "Baku",
            iso2: "AZ",
            continent: "Asia",
            currency: "AZN (₼)",
            language: "Azerbaijani",
            heroImage: "https://images.unsplash.com/photo-1565620731358-e8c038abc8d1?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1565620731358-e8c038abc8d1?q=80&w=800&auto=format&fit=crop",
            population: 10000000,
            seasonTips: ["Apr–Jun", "Sep–Oct"],
            topAttractions: [
                { name: "Flame Towers", blurb: "Modern Baku" },
                { name: "Old City", blurb: "Historic core" },
                { name: "Gobustan", blurb: "Mud volcanoes" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [{ q: "E-visa?", a: "Yes, ASAN visa is quick." }]
        },
        {
            slug: "georgia",
            name: "Georgia",
            capital: "Tbilisi",
            iso2: "GE",
            continent: "Europe",
            currency: "GEL (₾)",
            language: "Georgian",
            heroImage: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=800&auto=format&fit=crop",
            population: 3700000,
            seasonTips: ["May–Jun", "Sep–Oct"],
            topAttractions: [
                { name: "Tbilisi Old Town", blurb: "Charming streets" },
                { name: "Kazbegi", blurb: "Mountain views" },
                { name: "Batumi", blurb: "Black Sea resort" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [{ q: "E-visa?", a: "Yes, online process." }]
        },
        {
            slug: "morocco",
            name: "Morocco",
            capital: "Rabat",
            iso2: "MA",
            continent: "Africa",
            currency: "MAD (د.م.)",
            language: "Arabic, French",
            heroImage: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=800&auto=format&fit=crop",
            population: 37000000,
            seasonTips: ["Mar–May", "Sep–Oct"],
            topAttractions: [
                { name: "Marrakech", blurb: "Souks & Medina" },
                { name: "Sahara Desert", blurb: "Dunes" },
                { name: "Chefchaouen", blurb: "Blue City" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [{ q: "E-visa?", a: "Yes, for many countries." }]
        },
        {
            slug: "bangladesh",
            name: "Bangladesh",
            capital: "Dhaka",
            iso2: "BD",
            continent: "Asia",
            currency: "BDT (৳)",
            language: "Bengali",
            heroImage: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=800&auto=format&fit=crop",
            population: 169000000,
            seasonTips: ["Nov–Feb"],
            topAttractions: [
                { name: "Sundarbans", blurb: "Mangrove forest" },
                { name: "Cox's Bazar", blurb: "Longest beach" },
                { name: "Lalbagh Fort", blurb: "Mughal fort" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [{ q: "Visa on arrival?", a: "Available for some." }]
        },
        {
            slug: "laos",
            name: "Laos",
            capital: "Vientiane",
            iso2: "LA",
            continent: "Asia",
            currency: "LAK (₭)",
            language: "Lao",
            heroImage: "https://images.unsplash.com/photo-1540611025311-01df3cef54b5?q=80&w=2000&auto=format&fit=crop",
            cardImage: "https://images.unsplash.com/photo-1540611025311-01df3cef54b5?q=80&w=800&auto=format&fit=crop",
            population: 7500000,
            seasonTips: ["Nov–Mar"],
            topAttractions: [
                { name: "Luang Prabang", blurb: "Heritage site" },
                { name: "Vang Vieng", blurb: "Limestone karsts" },
                { name: "Kuang Si Falls", blurb: "Waterfalls" }
            ],
            visaNotes: ["Tourist", "Visit", "Business"],
            faqs: [{ q: "Visa on arrival?", a: "Yes, available at airports." }]
        }
    ],
    settings: {
        email: "info@rvxtravels.com",
        hours: "Mon-Sat: 10:00 AM - 7:00 PM IST",
    }
};
