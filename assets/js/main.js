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

const PHONE_COUNTRY_CODES = [
    { code: '+91', label: 'India (+91)' },
    { code: '+971', label: 'UAE (+971)' },
    { code: '+1', label: 'USA / Canada (+1)' },
    { code: '+44', label: 'UK (+44)' },
    { code: '+61', label: 'Australia (+61)' },
    { code: '+65', label: 'Singapore (+65)' },
    { code: '+974', label: 'Qatar (+974)' },
    { code: '+966', label: 'Saudi Arabia (+966)' },
    { code: '+968', label: 'Oman (+968)' },
    { code: '+965', label: 'Kuwait (+965)' },
    { code: '+973', label: 'Bahrain (+973)' },
    { code: '+27', label: 'South Africa (+27)' }
];

const PHONE_VALIDATION_RULES = {
    '+91': { regex: /^[6-9]\d{9}$/, message: 'Enter a valid Indian mobile number with 10 digits.' },
    '+971': { regex: /^\d{9}$/, message: 'Enter a valid UAE mobile number with 9 digits.' },
    '+1': { regex: /^\d{10}$/, message: 'Enter a valid USA or Canada mobile number with 10 digits.' },
    '+44': { regex: /^\d{10}$/, message: 'Enter a valid UK mobile number with 10 digits.' },
    '+61': { regex: /^\d{9}$/, message: 'Enter a valid Australia mobile number with 9 digits.' },
    '+65': { regex: /^\d{8}$/, message: 'Enter a valid Singapore mobile number with 8 digits.' },
    '+974': { regex: /^\d{8}$/, message: 'Enter a valid Qatar mobile number with 8 digits.' },
    '+966': { regex: /^\d{9}$/, message: 'Enter a valid Saudi Arabia mobile number with 9 digits.' },
    '+968': { regex: /^\d{8}$/, message: 'Enter a valid Oman mobile number with 8 digits.' },
    '+965': { regex: /^\d{8}$/, message: 'Enter a valid Kuwait mobile number with 8 digits.' },
    '+973': { regex: /^\d{8}$/, message: 'Enter a valid Bahrain mobile number with 8 digits.' },
    '+27': { regex: /^\d{9}$/, message: 'Enter a valid South Africa mobile number with 9 digits.' }
};

function getPhoneValidationRule(countryCode) {
    return PHONE_VALIDATION_RULES[countryCode] || {
        regex: /^\d{6,15}$/,
        message: 'Enter a valid mobile number using 6 to 15 digits.'
    };
}

function isValidEmailAddress(value) {
    const email = (value || '').trim();
    const parts = email.split('@');

    if (parts.length !== 2) return false;

    const [localPart, domain] = parts;
    if (!localPart || !domain || localPart.length > 64 || domain.length > 253) return false;
    if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) return false;
    if (!/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(localPart)) return false;

    const labels = domain.split('.');
    if (labels.length < 2) return false;

    return labels.every((label, index) => {
        if (!label || label.length > 63) return false;
        if (!/^[A-Za-z0-9-]+$/.test(label)) return false;
        if (label.startsWith('-') || label.endsWith('-')) return false;
        if (index === labels.length - 1 && !/^[A-Za-z]{2,}$/.test(label)) return false;
        return true;
    });
}

function validateNameField(form) {
    const field = form.querySelector('[name="name"]');
    if (!field) return true;

    const normalizedValue = (field.value || '').trim().replace(/\s+/g, ' ');
    field.value = normalizedValue;
    field.setCustomValidity('');

    if (!normalizedValue) {
        field.setCustomValidity('Enter your full name.');
    } else if (normalizedValue.length < 2) {
        field.setCustomValidity('Enter at least 2 characters for your name.');
    } else if (!/^[A-Za-z][A-Za-z\s'.-]{1,99}$/.test(normalizedValue)) {
        field.setCustomValidity('Enter a valid name using letters, spaces, apostrophes, dots, or hyphens.');
    }

    return field.reportValidity();
}

function validateEmailField(form) {
    const field = form.querySelector('[name="email"]');
    if (!field) return true;

    const normalizedValue = (field.value || '').trim();
    field.value = normalizedValue;
    field.setCustomValidity('');

    if (!normalizedValue) {
        field.setCustomValidity('Enter your email address.');
    } else if (!isValidEmailAddress(normalizedValue)) {
        field.setCustomValidity('Enter a valid email address with a real domain, for example name@example.com.');
    }

    return field.reportValidity();
}

function validateServiceField(form) {
    const field = form.querySelector('[name="visaType"]');
    if (!field) return true;

    field.setCustomValidity('');

    if (!field.value) {
        field.setCustomValidity('Select a visa or service type.');
    }

    return field.reportValidity();
}

function validateDestinationField(form) {
    const field = form.querySelector('[name="destination"]');
    if (!field) return true;

    const normalizedValue = (field.value || '').trim().replace(/\s+/g, ' ');
    field.value = normalizedValue;
    field.setCustomValidity('');

    if (!normalizedValue) {
        field.setCustomValidity('Enter the destination or service you need help with.');
    }

    return field.reportValidity();
}

function applyPhoneFieldConstraints(form) {
    const countryCodeField = form.querySelector('[name="phoneCountryCode"]');
    const mobileNumberField = form.querySelector('[name="mobileNumber"]');

    if (!countryCodeField || !mobileNumberField) {
        return;
    }

    const rule = getPhoneValidationRule(countryCodeField.value || '+91');
    mobileNumberField.pattern = rule.regex.source;
    mobileNumberField.title = rule.message;
}

function populateCountryCodeSelects(root = document) {
    root.querySelectorAll('.country-code-select').forEach(select => {
        if (!select || select.options.length > 0) return;

        PHONE_COUNTRY_CODES.forEach(({ code, label }) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = label;
            if (code === '+91') option.selected = true;
            select.appendChild(option);
        });
    });

    root.querySelectorAll('.country-code-select').forEach(select => {
        const form = select.form || select.closest('form');
        if (!form) return;

        applyPhoneFieldConstraints(form);

        if (select.dataset.phoneValidationBound === 'true') return;
        select.dataset.phoneValidationBound = 'true';
        select.addEventListener('change', () => applyPhoneFieldConstraints(form));
    });
}

function sanitizePhoneNumber(value) {
    return (value || '').replace(/\D/g, '');
}

function getPhonePayload(form) {
    const countryCode = form.querySelector('[name="phoneCountryCode"]')?.value || '+91';
    const mobileNumberField = form.querySelector('[name="mobileNumber"]');
    const mobileNumber = sanitizePhoneNumber(mobileNumberField?.value || '');

    if (mobileNumberField) {
        mobileNumberField.value = mobileNumber;
    }

    return {
        phoneCountryCode: countryCode,
        mobileNumber,
        phone: `${countryCode}${mobileNumber}`
    };
}

function validatePhoneFields(form) {
    const mobileNumberField = form.querySelector('[name="mobileNumber"]');
    const countryCodeField = form.querySelector('[name="phoneCountryCode"]');

    if (!mobileNumberField || !countryCodeField) {
        return true;
    }

    const mobileNumber = sanitizePhoneNumber(mobileNumberField.value);
    mobileNumberField.value = mobileNumber;
    mobileNumberField.setCustomValidity('');
    applyPhoneFieldConstraints(form);
    const rule = getPhoneValidationRule(countryCodeField.value || '+91');

    if (!mobileNumber) {
        mobileNumberField.setCustomValidity('Enter a mobile number.');
    } else if (!rule.regex.test(mobileNumber)) {
        mobileNumberField.setCustomValidity(rule.message);
    }

    if (!countryCodeField.value) {
        countryCodeField.setCustomValidity('Select a country code.');
    } else {
        countryCodeField.setCustomValidity('');
    }

    const isValid = countryCodeField.reportValidity() && mobileNumberField.reportValidity();
    if (!isValid) {
        mobileNumberField.focus();
    }

    return isValid;
}

function validateInquiryForm(form) {
    const validators = [
        () => validateNameField(form),
        () => validateEmailField(form),
        () => validateDestinationField(form),
        () => validateServiceField(form),
        () => validatePhoneFields(form)
    ];

    for (const validate of validators) {
        if (!validate()) {
            return false;
        }
    }

    return true;
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

const DEFAULT_SITE_SETTINGS = {
    siteUrl: 'https://rvx-travels.netlify.app',
    web3FormsEndpoint: 'https://api.web3forms.com/submit',
    web3FormsAccessKey: '',
    defaultOgImage: 'https://rvx-travels.netlify.app/assets/img/service_visa.png',
    brandName: 'Royal Visa Xpert',
    phone: '+91 95949 60707',
    analytics: {
        ga4MeasurementId: ''
    }
};

function getSiteSettings() {
    const sourceSettings = (typeof visaData !== 'undefined' && visaData.settings) ? visaData.settings : {};
    return {
        ...DEFAULT_SITE_SETTINGS,
        ...sourceSettings,
        analytics: {
            ...DEFAULT_SITE_SETTINGS.analytics,
            ...(sourceSettings.analytics || {})
        }
    };
}

function getCurrentPageName() {
    const pageName = window.location.pathname.split('/').pop();
    return pageName || 'index.html';
}

function getAbsoluteUrl(pathOrUrl) {
    if (!pathOrUrl) return getSiteSettings().siteUrl;
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

    const siteUrl = getSiteSettings().siteUrl.replace(/\/+$/, '');
    const normalizedPath = pathOrUrl.replace(/^\/+/, '');
    return `${siteUrl}/${normalizedPath}`;
}

function ensureMetaTag(attributeName, attributeValue, content) {
    let meta = document.head.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attributeName, attributeValue);
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
}

function ensureLinkTag(rel, href) {
    let link = document.head.querySelector(`link[rel="${rel}"]`);
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
    }
    link.setAttribute('href', href);
}

function getPageSeo(selectedCountry) {
    const settings = getSiteSettings();
    const pageName = getCurrentPageName();
    const baseTitle = settings.brandName;
    const defaultImage = settings.defaultOgImage;

    const seoByPage = {
        'index.html': {
            title: `${baseTitle} - Global Visas Made Simple`,
            description: 'Tourist, Family Visit and Business visas for popular destinations, plus tours, destination weddings and international license support from Royal Visa Xpert.',
            canonicalPath: '',
            image: defaultImage,
            robots: 'index, follow',
            type: 'website'
        },
        'visas.html': {
            title: `Visa Catalog - ${baseTitle}`,
            description: 'Browse destination visa support for tourist, family visit and business travel with easy country search, filters and travel guidance.',
            canonicalPath: 'visas.html',
            image: defaultImage,
            robots: 'index, follow',
            type: 'website'
        },
        'about.html': {
            title: `About Us - ${baseTitle}`,
            description: 'Learn about Royal Visa Xpert, our travel support services and how we help applicants across India with end-to-end visa assistance.',
            canonicalPath: 'about.html',
            image: defaultImage,
            robots: 'index, follow',
            type: 'website'
        },
        'enquiry.html': {
            title: `Send Enquiry - ${baseTitle}`,
            description: 'Send your visa or travel enquiry to Royal Visa Xpert for tourist, family visit, business, tours, destination wedding and international driving permit support.',
            canonicalPath: 'enquiry.html',
            image: defaultImage,
            robots: 'index, follow',
            type: 'website'
        },
        'international-driving-license.html': {
            title: `International Driving License (Permit) - ${baseTitle}`,
            description: 'Get guidance for your International Driving License Permit application, required documents, processing support and enquiry assistance from Royal Visa Xpert.',
            canonicalPath: 'international-driving-license.html',
            image: 'assets/img/service_license.png',
            robots: 'index, follow',
            type: 'website'
        },
        'privacy.html': {
            title: `Privacy Policy - ${baseTitle}`,
            description: 'Read the Royal Visa Xpert privacy policy and learn how enquiry details and customer information are handled.',
            canonicalPath: 'privacy.html',
            image: defaultImage,
            robots: 'index, follow',
            type: 'website'
        },
        'terms.html': {
            title: `Terms of Service - ${baseTitle}`,
            description: 'Review the terms of service for using Royal Visa Xpert travel and visa assistance services.',
            canonicalPath: 'terms.html',
            image: defaultImage,
            robots: 'index, follow',
            type: 'website'
        },
        'thank-you.html': {
            title: `Thank You - ${baseTitle}`,
            description: 'Confirmation page for successful Royal Visa Xpert enquiry submissions.',
            canonicalPath: 'thank-you.html',
            image: defaultImage,
            robots: 'noindex, nofollow',
            type: 'website'
        },
        'country.html': {
            title: `Visa Details - ${baseTitle}`,
            description: 'Detailed visa information, travel guidance, season tips and enquiry support for your selected destination.',
            canonicalPath: 'country.html',
            image: defaultImage,
            robots: 'index, follow',
            type: 'website'
        }
    };

    const pageSeo = seoByPage[pageName] || seoByPage['index.html'];

    if (pageName === 'country.html' && selectedCountry) {
        return {
            title: `${selectedCountry.name} Visa Services & Travel Info | ${baseTitle}`,
            description: `Tourist, Family Visit and Business visa support for ${selectedCountry.name}. Explore travel guidance, best time to visit, currency, language and enquiry help.`,
            canonicalPath: `country.html?code=${selectedCountry.slug}`,
            image: selectedCountry.heroImage || selectedCountry.cardImage || defaultImage,
            robots: 'index, follow',
            type: 'article'
        };
    }

    return pageSeo;
}

function applySeoMeta(selectedCountry) {
    const settings = getSiteSettings();
    const seo = getPageSeo(selectedCountry);
    const canonicalUrl = getAbsoluteUrl(seo.canonicalPath);
    const imageUrl = getAbsoluteUrl(seo.image);

    document.title = seo.title;
    ensureMetaTag('name', 'description', seo.description);
    ensureMetaTag('name', 'robots', seo.robots);
    ensureMetaTag('name', 'theme-color', '#1e2a78');
    ensureMetaTag('property', 'og:site_name', settings.brandName);
    ensureMetaTag('property', 'og:type', seo.type);
    ensureMetaTag('property', 'og:title', seo.title);
    ensureMetaTag('property', 'og:description', seo.description);
    ensureMetaTag('property', 'og:url', canonicalUrl);
    ensureMetaTag('property', 'og:image', imageUrl);
    ensureMetaTag('property', 'og:locale', 'en_IN');
    ensureMetaTag('name', 'twitter:card', 'summary_large_image');
    ensureMetaTag('name', 'twitter:title', seo.title);
    ensureMetaTag('name', 'twitter:description', seo.description);
    ensureMetaTag('name', 'twitter:image', imageUrl);
    ensureLinkTag('canonical', canonicalUrl);
}

function initAnalytics() {
    const measurementId = getSiteSettings().analytics.ga4MeasurementId;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
        window.dataLayer.push(arguments);
    };

    if (!measurementId) {
        return;
    }

    if (!document.getElementById('ga4-script')) {
        const analyticsScript = document.createElement('script');
        analyticsScript.id = 'ga4-script';
        analyticsScript.async = true;
        analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
        document.head.appendChild(analyticsScript);
    }

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
        anonymize_ip: true,
        page_path: window.location.pathname + window.location.search
    });
}

function trackAnalyticsEvent(eventName, params = {}) {
    if (typeof window.gtag !== 'function') {
        return;
    }

    window.gtag('event', eventName, params);
}

function initAnalyticsTracking() {
    if (!window.__rvxPageViewTracked) {
        window.__rvxPageViewTracked = true;
        trackAnalyticsEvent('rvx_page_view', {
            page_title: document.title,
            page_path: window.location.pathname,
            page_location: window.location.href
        });
    }

    document.querySelectorAll('[data-whatsapp]').forEach(link => {
        if (link.dataset.analyticsBound === 'true') return;
        link.dataset.analyticsBound = 'true';
        link.addEventListener('click', () => {
            trackAnalyticsEvent('whatsapp_click', {
                link_text: (link.textContent || '').trim() || 'whatsapp',
                page_path: window.location.pathname
            });
        });
    });

    document.querySelectorAll('form').forEach(form => {
        if (form.dataset.analyticsBound === 'true') return;
        form.dataset.analyticsBound = 'true';
        form.addEventListener('submit', () => {
            trackAnalyticsEvent('lead_form_submit', {
                form_name: form.getAttribute('name') || form.id || 'unknown',
                page_path: window.location.pathname
            });
        });
    });
}

function getWeb3FormsConfig() {
    const settings = getSiteSettings();

    return {
        endpoint: window.RVX_WEB3FORMS_ENDPOINT || settings.web3FormsEndpoint || 'https://api.web3forms.com/submit',
        accessKey: window.RVX_WEB3FORMS_ACCESS_KEY || settings.web3FormsAccessKey || ''
    };
}

function buildInquirySubject(payload) {
    const prefix = payload.urgentService ? 'Urgent Enquiry' : 'New Enquiry';
    const destination = payload.destination || 'General';
    const visaType = payload.visaType || 'General Inquiry';

    return `${prefix} - ${destination} - ${visaType}`;
}

async function submitInquiry(payload) {
    const { endpoint, accessKey } = getWeb3FormsConfig();

    if (!accessKey) {
        throw new Error('Web3Forms access key is not configured.');
    }

    if ((payload.company || '').trim()) {
        throw new Error('Invalid submission.');
    }

    const settings = getSiteSettings();
    const phone = payload.phone || `${payload.phoneCountryCode || '+91'}${payload.mobileNumber || ''}`;
    const message = payload.message || `New enquiry for ${payload.destination || 'General'} (${payload.visaType || 'General Inquiry'}).`;
    const formData = new FormData();

    formData.append('access_key', accessKey);
    formData.append('subject', buildInquirySubject(payload));
    formData.append('from_name', settings.brandName);
    formData.append('name', payload.name || '');
    formData.append('email', payload.email || '');
    formData.append('replyto', payload.email || '');
    formData.append('phone', phone);
    formData.append('phoneCountryCode', payload.phoneCountryCode || '+91');
    formData.append('mobileNumber', payload.mobileNumber || '');
    formData.append('destination', payload.destination || '');
    formData.append('visaType', payload.visaType || '');
    formData.append('urgentService', Boolean(payload.urgentService) ? 'Yes' : 'No');
    formData.append('message', message);
    formData.append('consent', payload.consent !== false ? 'Yes' : 'No');
    formData.append('sourcePage', payload.sourcePage || window.location.pathname);
    formData.append('botcheck', payload.company || '');

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: formData
    });

    const responseBody = await response.json().catch(() => null);

    if (!response.ok || !responseBody || responseBody.success !== true) {
        const errorMessage = responseBody && responseBody.message
            ? responseBody.message
            : 'Unable to send your enquiry right now. Please try again or contact us on WhatsApp.';

        throw new Error(errorMessage);
    }

    return {
        ok: true,
        data: responseBody
    };
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
    applySeoMeta();
    initAnalytics();

    // Initialize Lucide Icons
    lucide.createIcons();

    // Load Global Settings (Phone, Email, etc.)
    loadSettings();
    initWhatsAppLinks();
    initAnalyticsTracking();
    populateCountryCodeSelects();

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

function injectSchema(selectedCountry) {
    const settings = getSiteSettings();
    const seo = getPageSeo(selectedCountry);
    const schemaId = 'rvx-structured-data';
    const existingSchema = document.getElementById(schemaId);

    if (existingSchema) {
        existingSchema.remove();
    }

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "@id": `${settings.siteUrl}#organization`,
        "name": settings.brandName,
        "url": settings.siteUrl,
        "image": getAbsoluteUrl(settings.defaultOgImage),
        "description": "Professional visa assistance services for tourists, family visitors and business travelers.",
        "email": settings.email,
        "telephone": settings.phone,
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN"
        },
        "areaServed": {
            "@type": "Country",
            "name": "India"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "telephone": settings.phone,
            "email": settings.email,
            "areaServed": "IN",
            "availableLanguage": "en"
        }
    };

    const websiteSchema = {
        "@type": "WebSite",
        "@id": `${settings.siteUrl}#website`,
        "url": settings.siteUrl,
        "name": settings.brandName,
        "publisher": {
            "@id": `${settings.siteUrl}#organization`
        },
        "inLanguage": "en-IN"
    };

    const webPageSchema = {
        "@type": "WebPage",
        "@id": `${getAbsoluteUrl(seo.canonicalPath)}#webpage`,
        "url": getAbsoluteUrl(seo.canonicalPath),
        "name": seo.title,
        "description": seo.description,
        "isPartOf": {
            "@id": `${settings.siteUrl}#website`
        },
        "about": {
            "@id": `${settings.siteUrl}#organization`
        },
        "primaryImageOfPage": getAbsoluteUrl(seo.image),
        "inLanguage": "en-IN"
    };

    const graph = [organizationSchema, websiteSchema, webPageSchema];

    if (selectedCountry) {
        graph.push({
            "@type": "TouristDestination",
            "name": selectedCountry.name,
            "description": `Travel and visa guidance for ${selectedCountry.name}.`,
            "touristType": getCountryVisaNotes(selectedCountry).join(', '),
            "containedInPlace": selectedCountry.continent,
            "image": getAbsoluteUrl(selectedCountry.heroImage || selectedCountry.cardImage || settings.defaultOgImage)
        });
    }

    const schemaScript = document.createElement('script');
    schemaScript.id = schemaId;
    schemaScript.type = 'application/ld+json';
    schemaScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": graph
    });
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
    const initialParams = new URLSearchParams(window.location.search);

    function normalizeCatalogTerm(value) {
        return (value || '')
            .toString()
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    function syncCatalogQueryParams(searchTerm, continent, countrySlug) {
        const params = new URLSearchParams(window.location.search);

        if (searchTerm) {
            params.set('search', searchTerm);
        } else {
            params.delete('search');
        }

        if (continent && continent !== 'all') {
            params.set('continent', continent);
        } else {
            params.delete('continent');
        }

        if (countrySlug && countrySlug !== 'all') {
            params.set('country', countrySlug);
        } else {
            params.delete('country');
        }

        const query = params.toString();
        const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
        window.history.replaceState({}, '', nextUrl);
    }

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
        const rawSearchTerm = searchInput ? searchInput.value : '';
        const searchTerm = normalizeCatalogTerm(rawSearchTerm);
        const continent = continentFilter ? continentFilter.value : 'all';
        const countrySlug = countryFilter ? countryFilter.value : 'all';

        // Toggle recommended section visibility
        const isFiltering = searchTerm !== '' || continent !== 'all' || countrySlug !== 'all';
        if (recommendedSection) {
            recommendedSection.style.display = isFiltering ? 'none' : 'block';
        }

        const filtered = countries.filter(country => {
            const normalizedName = normalizeCatalogTerm(country.name);
            const normalizedSlug = normalizeCatalogTerm(country.slug);
            const matchesSearch = searchTerm === ''
                || normalizedName.includes(searchTerm)
                || normalizedSlug.includes(searchTerm);
            const matchesContinent = continent === 'all' || country.continent === continent;
            const matchesCountry = countrySlug === 'all' || country.slug === countrySlug;

            return matchesSearch && matchesContinent && matchesCountry;
        });

        syncCatalogQueryParams(rawSearchTerm.trim(), continent, countrySlug);
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

    function applyInitialCatalogFilters() {
        if (continentFilter) {
            const requestedContinent = initialParams.get('continent');
            const hasContinentOption = requestedContinent
                && Array.from(continentFilter.options).some(option => option.value === requestedContinent);

            if (hasContinentOption) {
                continentFilter.value = requestedContinent;
            }
        }

        if (searchInput) {
            searchInput.value = initialParams.get('search') || '';
        }

        updateCountryOptions();

        if (countryFilter) {
            const requestedCountry = initialParams.get('country');
            const hasCountryOption = requestedCountry
                && Array.from(countryFilter.options).some(option => option.value === requestedCountry);

            if (hasCountryOption) {
                countryFilter.value = requestedCountry;
            }
        }

        filterData();
    }

    // Event Listeners
    if (searchInput) {
        ['input', 'search', 'change', 'keyup'].forEach(eventName => {
            searchInput.addEventListener(eventName, filterData);
        });
    }
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
    if (countryFilter) {
        applyInitialCatalogFilters();
    } else {
        filterData();
    }

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
    applySeoMeta(country);
    injectSchema(country);
    trackAnalyticsEvent('view_country_destination', {
        country_name: country.name,
        country_slug: country.slug
    });

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
            ...getPhonePayload(form),
            destination: country.name,
            visaType: form.querySelector('#visa-type')?.value || 'Tourist Visa',
            urgentService: false,
            message: form.querySelector('#message')?.value?.trim() || '',
            company: '',
            consent: true,
            sourcePage: `country:${country.slug}`
        };

        if (!validateInquiryForm(form)) {
            if (submitButton) {
                submitButton.textContent = originalLabel;
                submitButton.disabled = false;
            }
            return;
        }

        try {
            await submitInquiry(payload);
            window.location.href = `thank-you.html?destination=${encodeURIComponent(country.name)}`;
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Unable to send your enquiry right now. Please try again or contact us on WhatsApp.';
            window.alert(errorMessage);
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
                           (serviceParam === 'License' || serviceParam === 'IDP') ? 'International Driving License (Permit)' : 
                           serviceParam === 'Wedding' ? 'Destination Wedding' :
                           serviceParam === 'SIM' ? 'Other' :
                           serviceParam;
        
        const exists = Array.from(destSelect.options).some(opt => opt.value === serviceLabel);
        if (!exists) {
            const option = document.createElement('option');
            option.value = serviceLabel;
            option.textContent = serviceLabel;
            destSelect.appendChild(option);
        }
        destSelect.value = serviceLabel;
    }

    // This legacy form only updates button state before the browser submits it.
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
