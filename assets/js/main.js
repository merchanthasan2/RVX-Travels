function formatVisaNote(note) {
    return note === 'Visit' ? 'Family Visit' : note;
}

function getStandardVisaNotes() {
    return ['Tourist', 'Family Visit', 'Business'];
}

function getCountryVisaNotes() {
    return getStandardVisaNotes();
}

function isSchengenVisaCountry(country) {
    return Boolean(country && Array.isArray(country.visaNotes) && country.visaNotes.includes('Schengen Visa'));
}

function getCountryImageBadgeMarkup(country) {
    if (!isSchengenVisaCountry(country)) return '';

    return '<span class="country-image-badge">Schengen Visa</span>';
}

function buildWhatsAppLinks(preset) {
    const phone = ['91', '95949', '60707'].join('');
    const presets = {
        visa: "Hi, I'd like to enquire about visa services"
    };
    const message = presets[preset] || '';
    const encodedMessage = encodeURIComponent(message);
    const nativeLink = encodedMessage
        ? `whatsapp://send?phone=${phone}&text=${encodedMessage}`
        : `whatsapp://send?phone=${phone}`;
    const androidIntent = encodedMessage
        ? `intent://send?phone=${phone}&text=${encodedMessage}#Intent;scheme=whatsapp;package=com.whatsapp;end`
        : `intent://send?phone=${phone}#Intent;scheme=whatsapp;package=com.whatsapp;end`;
    const webLink = encodedMessage
        ? `https://web.whatsapp.com/send/?phone=${phone}&text=${encodedMessage}&type=phone_number&app_absent=0`
        : `https://web.whatsapp.com/send/?phone=${phone}&type=phone_number&app_absent=0`;

    return { nativeLink, androidIntent, webLink };
}

function getWhatsAppDeviceProfile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
    const isAndroid = /Android/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

    return { isAndroid, isIOS };
}

function openWhatsAppChat(preset) {
    const { nativeLink, androidIntent, webLink } = buildWhatsAppLinks(preset);
    const { isAndroid, isIOS } = getWhatsAppDeviceProfile();

    if (!isAndroid && !isIOS) {
        window.location.href = webLink;
        return;
    }

    const appLink = isAndroid ? androidIntent : nativeLink;
    const fallbackDelay = isAndroid ? 1800 : 2600;
    let fallbackTimer = null;

    const cleanup = () => {
        if (fallbackTimer) {
            window.clearTimeout(fallbackTimer);
            fallbackTimer = null;
        }
        window.removeEventListener('pagehide', handleLeave);
        window.removeEventListener('blur', handleLeave);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

    const handleLeave = () => cleanup();
    const handleVisibilityChange = () => {
        if (document.hidden) cleanup();
    };

    window.addEventListener('pagehide', handleLeave, { once: true });
    window.addEventListener('blur', handleLeave, { once: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    fallbackTimer = window.setTimeout(() => {
        cleanup();
        if (!document.hidden) {
            window.location.href = webLink;
        }
    }, fallbackDelay);

    window.location.href = appLink;
}

function initWhatsAppLinks() {
    document.querySelectorAll('[data-whatsapp]').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            openWhatsAppChat(link.getAttribute('data-whatsapp'));
        });
    });
}

function getCountryImagePlaceholder(label) {
    const safeLabel = `${label} scenic view`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
        <defs>
            <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stop-color="#1e2a78"/>
                <stop offset="100%" stop-color="#ff6b00"/>
            </linearGradient>
        </defs>
        <rect width="800" height="520" fill="url(#g)"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="34">${safeLabel}</text>
    </svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

async function submitEnquiryToNetlify(payload) {
    const body = new URLSearchParams({
        'form-name': 'enquiry',
        name: payload.name || '',
        email: payload.email || '',
        destination: payload.destination || '',
        visaType: payload.visaType || '',
        urgentService: String(Boolean(payload.urgentService)),
        message: payload.message || '',
        company: payload.company || '',
        consent: String(payload.consent !== false),
        sourcePage: payload.sourcePage || window.location.pathname
    });

    const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
    });

    if (!response.ok) {
        throw new Error(`Enquiry submission failed with status ${response.status}`);
    }

    return response;
}

function getCountryImageSources(country, imageType) {
    if (!country) return [];

    const sources = imageType === 'hero'
        ? [country.heroImage, country.heroImageBackup]
        : [country.cardImage, country.cardImageBackup];

    return sources.filter(Boolean);
}

function setSequentialImageFallback(imageEl, sources, placeholder) {
    if (!imageEl) return;

    const queue = sources.slice();
    let currentIndex = 0;

    const applyNext = () => {
        if (currentIndex < queue.length) {
            imageEl.src = queue[currentIndex];
            currentIndex += 1;
            return;
        }

        imageEl.src = placeholder;
    };

    imageEl.addEventListener('error', () => {
        applyNext();
    });

    applyNext();
}

function probeImageSource(sourceUrl) {
    return new Promise((resolve, reject) => {
        const probeImage = new Image();
        probeImage.onload = () => resolve(sourceUrl);
        probeImage.onerror = () => reject(new Error(`Unable to load ${sourceUrl}`));
        probeImage.src = sourceUrl;
    });
}

function hydrateCountryCardImage(imageEl, country) {
    if (!imageEl || !country) return;

    setSequentialImageFallback(
        imageEl,
        getCountryImageSources(country, 'card'),
        getCountryImagePlaceholder(country.name)
    );
}

async function applyCountryBackgroundImage(element, country, gradientPrefix = '') {
    if (!element || !country) return;
    const sources = getCountryImageSources(country, 'hero');
    const fallbackImage = getCountryImagePlaceholder(country.name);

    const setBackground = (sourceUrl) => {
        if (!sourceUrl) {
            element.style.backgroundColor = '#1e2a78';
            element.style.backgroundImage = gradientPrefix || 'none';
            return;
        }
        element.style.backgroundImage = gradientPrefix
            ? `${gradientPrefix}, url('${sourceUrl}')`
            : `url('${sourceUrl}')`;
    };

    for (const sourceUrl of sources) {
        try {
            const resolvedSource = await probeImageSource(sourceUrl);
            setBackground(resolvedSource);
            return;
        } catch (error) {
            continue;
        }
    }

    setBackground(fallbackImage);
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Load Global Settings (Phone, Email, etc.)
    loadSettings();
    initWhatsAppLinks();

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            // Swap icon: menu â†” x
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
                lucide.createIcons();
            }
        });

        // Close menu when a nav link is clicked
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            }
        });
    }

    // Initialize Home Page Components if on Home Page
    if (document.querySelector('.hero')) {
        if (document.getElementById('destination-track')) initDestinationCarousel();
        initParticles();
        if (document.getElementById('home-visa-grid')) initHomeVisaGrid();
    }

    // Initialize Visa Catalog if on Visas Page
    if (document.getElementById('visa-grid')) {
        initVisaCatalog();
    }

    // Initialize Country Detail if on Country Page
    if (document.getElementById('country-content')) {
        initCountryDetail();
    }

    // Initialize Forms
    initForms();

    // Inject SEO Schema
    injectSchema();
});

function injectSchema() {
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": "Royal Visa Xpert",
        "image": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80",
        "description": "Professional visa assistance services for tourists and business travelers.",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN"
        },
        "telephone": "+91 95949 60707",
        "priceRange": "$$"
    };

    // Merge with dynamic data if available
    if (typeof visaData !== 'undefined' && visaData.settings) {
        organizationSchema.email = visaData.settings.email;
    }

    schemaScript.textContent = JSON.stringify(organizationSchema);
    document.head.appendChild(schemaScript);
}


function loadSettings() {
    const emailEls = document.querySelectorAll('#footer-email, #contact-email');

    if (typeof visaData !== 'undefined' && visaData.settings) {
        emailEls.forEach(el => el.textContent = visaData.settings.email);

        // Populate hours
        const hoursEl = document.getElementById('contact-hours');
        if (hoursEl) hoursEl.textContent = visaData.settings.hours;
    }
}

/* --- Carousel Logic --- */
function initDestinationCarousel() {
    const track = document.getElementById('destination-track');
    const indicatorsContainer = document.getElementById('carousel-indicators');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (!track || !visaData || !visaData.countries) return;

    const countries = visaData.countries;
    let currentIndex = 0;
    let autoRotateInterval;

    // Render Slides
    countries.forEach((country, index) => {
        const slide = document.createElement('div');
        slide.classList.add('carousel-slide');
        if (index === 0) slide.classList.add('active');

        applyCountryBackgroundImage(slide, country, 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)');

        slide.innerHTML = `
            <div class="slide-content">
                <h3>${country.name}</h3>
                <p>Explore ${country.name} with our expert visa assistance.</p>
                <a href="visas.html?country=${country.slug}" class="btn btn-primary btn-sm">Check Visa</a>
            </div>
        `;

        track.appendChild(slide);

        // Indicators
        const dot = document.createElement('button');
        dot.classList.add('indicator-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(dot);
    });

    const slides = track.querySelectorAll('.carousel-slide');
    const dots = indicatorsContainer.querySelectorAll('.indicator-dot');

    function goToSlide(index) {
        slides[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');

        currentIndex = index;
        if (currentIndex >= slides.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = slides.length - 1;

        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // Event Listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoRotate();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoRotate();
    });

    // Auto Rotate
    function startAutoRotate() {
        autoRotateInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoRotate() {
        clearInterval(autoRotateInterval);
        startAutoRotate();
    }

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoRotateInterval));
    track.addEventListener('mouseleave', startAutoRotate);

    startAutoRotate();
}

/* --- Particles Logic (Simple CSS/JS implementation) --- */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;

    const duration = Math.random() * 10 + 5;
    particle.style.animationDuration = `${duration}s`;

    container.appendChild(particle);
}

/* --- Visa Catalog Logic --- */
function initVisaCatalog() {
    const grid = document.getElementById('visa-grid');
    const recommendedGrid = document.getElementById('recommended-grid');
    const recommendedSection = document.getElementById('recommended-section');
    const searchInput = document.getElementById('search-input');
    const continentFilter = document.getElementById('continent-filter');
    const countryFilter = document.getElementById('country-filter');
    const noResults = document.getElementById('no-results');

    if (!grid || !visaData) return;

    const countries = [...visaData.countries];

    function renderGrid(data, targetGrid) {
        targetGrid.innerHTML = '';
        
        if (data.length === 0) {
            if (targetGrid === grid) noResults.style.display = 'block';
            return;
        } else if (targetGrid === grid) {
            noResults.style.display = 'none';
        }

        data.forEach(country => {
            const card = document.createElement('div');
            card.classList.add('country-card');
            
            const tagsHtml = getCountryVisaNotes(country).map(note =>
                `<span class="visa-tag">${formatVisaNote(note)}</span>`
            ).join('');

            card.innerHTML = `
                <div class="card-image">
                    <img src="${country.cardImage}" alt="${country.name} scenic view" loading="lazy" referrerpolicy="no-referrer">
                    ${getCountryImageBadgeMarkup(country)}
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3>${country.name}</h3>
                        <span class="flag-badge">${getFlagEmoji(country.iso2)}</span>
                    </div>
                    <div class="visa-types">
                        ${tagsHtml}
                    </div>
                    <div class="card-footer">
                        <a href="country.html?code=${country.slug}" class="btn btn-outline btn-sm" style="color: var(--color-primary); border-color: var(--color-primary); width: 100%;">View Details</a>
                    </div>
                </div>
            `;

            const btn = card.querySelector('.btn');
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openCountryModal(country);
            });

            const imageEl = card.querySelector('.card-image img');
            hydrateCountryCardImage(imageEl, country);

            targetGrid.appendChild(card);
        });

        lucide.createIcons();
    }

    function filterData() {
        const searchTerm = searchInput.value.toLowerCase();
        const continent = continentFilter ? continentFilter.value : 'all';
        const countrySlug = countryFilter ? countryFilter.value : 'all';

        // Toggle recommended section visibility
        const isFiltering = searchTerm !== '' || continent !== 'all' || countrySlug !== 'all';
        if (recommendedSection) {
            recommendedSection.style.display = isFiltering ? 'none' : 'block';
        }

        const filtered = countries.filter(country => {
            const matchesSearch = country.name.toLowerCase().includes(searchTerm);
            const matchesContinent = continent === 'all' || country.continent === continent;
            const matchesCountry = countrySlug === 'all' || country.slug === countrySlug;

            return matchesSearch && matchesContinent && matchesCountry;
        });

        renderGrid(filtered, grid);
    }

    function updateCountryOptions() {
        if (!countryFilter) return;
        const continent = continentFilter ? continentFilter.value : 'all';

        countryFilter.innerHTML = '<option value="all">Select Country: All</option>';
        
        const filteredCountries = continent === 'all' 
            ? countries 
            : countries.filter(c => c.continent === continent);

        filteredCountries.forEach(c => {
            const option = document.createElement('option');
            option.value = c.slug;
            option.textContent = c.name;
            countryFilter.appendChild(option);
        });
        
        filterData();
    }

    // Event Listeners
    if (searchInput) searchInput.addEventListener('input', filterData);
    if (continentFilter) continentFilter.addEventListener('change', updateCountryOptions);
    if (countryFilter) countryFilter.addEventListener('change', filterData);

    // Initial Render
    const recommendedCountries = countries.filter(c => c.recommended);
    if (recommendedGrid && recommendedCountries.length > 0) {
        renderGrid(recommendedCountries, recommendedGrid);
    } else if (recommendedSection) {
        recommendedSection.style.display = 'none';
    }

    renderGrid(countries, grid);
    if (countryFilter) updateCountryOptions(); // Populate country dropdown initially

    // Modal Close Listener
    const modal = document.getElementById('country-modal');
    const closeBtn = document.getElementById('modal-close');

    if (closeBtn) closeBtn.addEventListener('click', closeCountryModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeCountryModal();
        });
    }
}

function closeCountryModal() {
    const modal = document.getElementById('country-modal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

function openCountryModal(country) {
    const modal = document.getElementById('country-modal');
    if (!modal) return;

    // Populate Data
    const flagEmoji = getFlagEmoji(country.iso2);
    document.getElementById('modal-country-name').textContent = `${flagEmoji} ${country.name}`;
    document.getElementById('modal-name-span').textContent = country.name;
    applyCountryBackgroundImage(document.getElementById('modal-hero-img'), country);

    // Tags
    const tagsContainer = document.getElementById('modal-visa-tags');
    tagsContainer.innerHTML = getCountryVisaNotes(country).map(note =>
        `<span class="visa-tag">${formatVisaNote(note)}</span>`
    ).join('');

    // Inquire Button
    const inquireBtn = document.getElementById('modal-inquire-btn');
    if (inquireBtn) inquireBtn.href = `enquiry.html?destination=${encodeURIComponent(country.name)}`;

    // Show Modal
    modal.classList.add('active');
    document.body.classList.add('modal-open');

    // Set Travel Information
    document.getElementById('modal-pop').textContent = formatPopulation(country.population);
    document.getElementById('modal-currency').textContent = country.currency || 'N/A';
    document.getElementById('modal-language').textContent = country.language || 'N/A';
    document.getElementById('modal-season').textContent = country.seasonTips ? country.seasonTips.join(', ') : 'Year-round';

    // Refresh icons
    lucide.createIcons();
}

async function fetchModalWeather(capital) {
    try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${capital}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();

        if (geoData.results && geoData.results.length > 0) {
            const { latitude, longitude } = geoData.results[0];

            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const weatherData = await weatherRes.json();

            document.getElementById('modal-weather').textContent = `${weatherData.current_weather.temperature}Â°C`;

            // Distance
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const dist = haversineDistance(position.coords.latitude, position.coords.longitude, latitude, longitude);
                    document.getElementById('modal-dist').textContent = `${Math.round(dist)} km`;
                });
            }
        }
    } catch (e) {
        console.error(e);
        document.getElementById('modal-weather').textContent = "N/A";
    }
}

// Helper to get flag emoji from ISO code
function getFlagEmoji(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

/* --- Country Detail Logic --- */
function initCountryDetail() {
    const params = new URLSearchParams(window.location.search);
    const countrySlug = params.get('code');

    const contentContainer = document.getElementById('country-content');
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');

    if (!countrySlug || !visaData) {
        loadingState.style.display = 'none';
        errorState.style.display = 'block';
        return;
    }

    const country = visaData.countries.find(c => c.slug === countrySlug);

    if (!country) {
        loadingState.style.display = 'none';
        errorState.style.display = 'block';
        return;
    }

    // Populate Data
    document.title = `${country.name} Visa - Royal Visa Xpert`;

    // Hero
    const hero = document.getElementById('country-hero');
    applyCountryBackgroundImage(hero, country, 'var(--gradient-hero)');
    document.getElementById('country-name').textContent = country.name;
    document.getElementById('country-capital').textContent = country.capital;
    document.getElementById('country-time').textContent = "Local Time";

    // Snapshot
    document.getElementById('pop-val').textContent = formatPopulation(country.population);
    document.getElementById('season-val').textContent = country.seasonTips.join(', ');
    const formCountryName = document.getElementById('form-country-name');
    if (formCountryName) formCountryName.textContent = country.name;
    initCountryLeadForm(country);

    // Attractions
    const attractionsList = document.getElementById('attractions-list');
    attractionsList.innerHTML = country.topAttractions.map(att => `
        <li>
            <h4>${att.name}</h4>
            <p>${att.blurb}</p>
        </li>
    `).join('');

    // Visa Types
    const visaTypesList = document.getElementById('visa-types-list');
    visaTypesList.innerHTML = getCountryVisaNotes(country).map(note =>
        `<span class="visa-tag">${formatVisaNote(note)}</span>`
    ).join('');

    // FAQ
    const faqList = document.getElementById('faq-list');
    faqList.innerHTML = country.faqs.map((faq, index) => `
        <div class="accordion-item">
            <div class="accordion-header" onclick="toggleAccordion(this)">
                ${faq.q}
                <i data-lucide="chevron-down"></i>
            </div>
            <div class="accordion-content">
                <p>${faq.a}</p>
            </div>
        </div>
    `).join('');

    function toggleAccordion(header) {
        const item = header.parentElement;
        item.classList.toggle('active');
        const icon = header.querySelector('i');
    }

    // Weather Fetch (Mock or Real)
    async function fetchWeather(capital) {
        const weatherEl = document.getElementById('weather-val');
        try {
            // Using Open-Meteo Geocoding to get coords then weather
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${capital}&count=1&language=en&format=json`);
            const geoData = await geoRes.json();

            if (geoData.results && geoData.results.length > 0) {
                const { latitude, longitude, timezone } = geoData.results[0];

                // Fetch Weather
                const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
                const weatherData = await weatherRes.json();

                const temp = weatherData.current_weather.temperature;
                weatherEl.textContent = `${temp}Â°C`;

                // Also update time since we have timezone now
                updateLocalTime(timezone);

                // Also calculate distance if we have user location
                getUserLocation(latitude, longitude);

            } else {
                weatherEl.textContent = "N/A";
            }
        } catch (e) {
            console.error("Weather fetch failed", e);
            weatherEl.textContent = "N/A";
        }
    }

    function updateLocalTime(timezone) {
        try {
            const timeString = new Date().toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit' });
            document.getElementById('country-time').textContent = timeString;
        } catch (e) {
            console.error("Time calc failed", e);
        }
    }

    function getUserLocation(destLat, destLon) {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;
                const dist = haversineDistance(userLat, userLon, destLat, destLon);
                document.getElementById('dist-val').textContent = `${Math.round(dist)} km`;
            }, (error) => {
                document.getElementById('dist-val').textContent = "Loc Denied";
            });
        } else {
            document.getElementById('dist-val').textContent = "N/A";
        }
    }

    function haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

}

function initCountryLeadForm(country) {
    const form = document.getElementById('lead-form');
    if (!form || !country || form.dataset.bound === 'true') return;

    form.dataset.bound = 'true';
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const originalLabel = submitButton ? submitButton.textContent : '';

        if (submitButton) {
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
        }

        const payload = {
            name: form.querySelector('#name')?.value?.trim() || '',
            email: form.querySelector('#email')?.value?.trim() || '',
            destination: country.name,
            visaType: form.querySelector('#visa-type')?.value || 'Tourist Visa',
            urgentService: false,
            message: form.querySelector('#message')?.value?.trim() || '',
            company: '',
            consent: true,
            sourcePage: `country:${country.slug}`
        };

        try {
            await submitEnquiryToNetlify(payload);
            window.location.href = `thank-you.html?destination=${encodeURIComponent(country.name)}`;
        } catch (error) {
            window.alert('Something went wrong. Please try again or contact us on WhatsApp.');
            if (submitButton) {
                submitButton.textContent = originalLabel;
                submitButton.disabled = false;
            }
        }
    });
}


function formatPopulation(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num;
}

function initForms() {
    const form = document.getElementById('contact-form');
    const destSelect = document.getElementById('destination');

    if (!form) return;

    // Populate Destination Dropdown
    if (destSelect && visaData && visaData.countries) {
        visaData.countries.sort((a, b) => a.name.localeCompare(b.name)).forEach(country => {
            const option = document.createElement('option');
            option.value = country.name;
            option.textContent = country.name;
            destSelect.appendChild(option);
        });
    }

    // Pre-fill from URL
    const params = new URLSearchParams(window.location.search);
    const destParam = params.get('destination');
    
    if (destParam && destSelect) {
        // If it's a specific service (Tours, License, etc.) not in the country list, add it
        const exists = Array.from(destSelect.options).some(opt => opt.value === destParam);
        if (!exists) {
            const option = document.createElement('option');
            option.value = destParam;
            option.textContent = destParam;
            destSelect.appendChild(option);
        }
        destSelect.value = destParam;
    }

    const serviceParam = params.get('service');
    if (serviceParam && destSelect) {
        const serviceLabel = serviceParam === 'Tours' ? 'Holiday Tours' : 
                           serviceParam === 'License' ? 'International License' : 
                           serviceParam === 'SIM' ? 'International SIM Card' : serviceParam;
        
        const exists = Array.from(destSelect.options).some(opt => opt.value === serviceLabel);
        if (!exists) {
            const option = document.createElement('option');
            option.value = serviceLabel;
            option.textContent = serviceLabel;
            destSelect.appendChild(option);
        }
        destSelect.value = serviceLabel;
    }

    // Web3Forms handles submission natively via POST
    // No need to prevent default - let the form submit naturally
    form.addEventListener('submit', (e) => {
        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Sending...';
        btn.disabled = true;

        // Honeypot check - prevent submission if honeypot is filled
        const botcheck = document.querySelector('input[name="botcheck"]');
        if (botcheck && botcheck.checked) {
            e.preventDefault();
            return false;
        }
    });
}

function initHomeVisaGrid() {
    const grid = document.getElementById('home-visa-grid');
    if (!grid || !visaData) return;

    // Show top 6 countries for home page
    const topCountries = visaData.countries.slice(0, 6);

    grid.innerHTML = '';
    topCountries.forEach(country => {
        const card = document.createElement('div');
        card.classList.add('country-card');

        // Generate Visa Tags
        const tagsHtml = getCountryVisaNotes(country).map(note =>
            `<span class="visa-tag">${formatVisaNote(note)}</span>`
        ).join('');

        card.innerHTML = `
            <div class="card-image">
                <img src="${country.cardImage}" alt="${country.name} scenic view" loading="lazy" referrerpolicy="no-referrer">
                ${getCountryImageBadgeMarkup(country)}
            </div>
            <div class="card-content">
                <div class="card-header">
                    <h3>${country.name}</h3>
                    <span class="flag-badge">${getFlagEmoji(country.iso2)}</span>
                </div>
                <div class="visa-types">
                    ${tagsHtml}
                </div>
                <div class="card-footer">
                    <a href="enquiry.html" class="btn btn-outline btn-sm" style="color: var(--color-primary); border-color: var(--color-primary); width: 100%;">View Details</a>
                </div>
            </div>
        `;

        // Home page cards navigate to the full country detail page
        const detailBtn = card.querySelector('.btn');
        detailBtn.href = `country.html?code=${country.slug}`;

        const imageEl = card.querySelector('.card-image img');
        hydrateCountryCardImage(imageEl, country);

        grid.appendChild(card);
    });

    lucide.createIcons();
}
