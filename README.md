# Royal Visa Xpert

Royal Visa Xpert is a completed multi-page travel and visa website for a visa consultancy brand. The project includes a polished static frontend, a 52-destination visa catalogue, enquiry and WhatsApp lead funnels, SEO/favicons, and an optional Express/TypeScript backend for self-hosted enquiry handling.

## Project status

This repository is the final working project snapshot for the Royal Visa Xpert website.

Included in this project:

- Branded landing page and service navigation
- Visa catalogue with 52 destinations
- Country detail experience driven by shared data
- Enquiry journey for visa, tours, destination wedding, and international driving permit leads
- WhatsApp-first contact flow
- SEO metadata, robots, manifest, and favicon package
- cPanel-oriented static deployment config
- Optional Node/Express backend for secure enquiry processing if a self-hosted API is preferred later

## Main pages

- `index.html`: home page and service overview
- `visas.html`: searchable and filterable visa catalogue
- `country.html`: destination detail template driven by query string and shared data
- `enquiry.html`: enquiry form and lead capture experience
- `international-driving-license.html`: dedicated service page
- `about.html`: company/about page
- `whatsapp.html`: WhatsApp redirection entry page
- `privacy.html`, `terms.html`, `thank-you.html`: support and legal pages

## Frontend structure

- `assets/css/style.css`: shared visual system and page styling
- `assets/js/main.js`: catalogue rendering, enquiry submission, SEO helpers, WhatsApp routing, validation, and interactive UI behavior
- `assets/js/data.js`: destination catalogue plus runtime site settings
- `assets/images/` and `assets/img/`: brand assets, service art, and destination imagery

The live frontend currently submits enquiries through the configured Web3Forms endpoint in `assets/js/data.js`. The backend in `server/` is available as a self-hosted alternative but is not the default browser submission path in the static site as checked in.

## Backend structure

The optional backend lives in `server/` and provides:

- `server/src/server.ts`: Express app, security headers, static file serving, and health check
- `server/src/routes/inquiry.ts`: validation, rate limiting, honeypot handling, and inquiry logging
- `server/src/services/emailService.ts`: SMTP-based admin and customer email delivery

### Backend environment variables

Create `server/.env` if you want to run the API:

```env
APP_ENV=development
PORT=3000
ALLOWED_ORIGIN=http://127.0.0.1:8085
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
MAIL_FROM=your-from-address
MAIL_TO=info@rvxtravels.com
```

## Local preview

### Static site

Quickest options:

- Open `index.html` directly in a browser
- Use the included PowerShell server helpers
- Use VS Code Live Server

The repo also includes [HOW_TO_VIEW.md](./HOW_TO_VIEW.md) with local viewing notes.

### Optional backend

From `server/`:

```powershell
npm install
npm run dev
```

Build for Node hosting:

```powershell
npm run build
npm start
```

## Deployment notes

- `.cpanel.yml` is prepared for static cPanel deployment into `public_html`
- The cPanel script copies the HTML pages, shared assets, favicon files, manifest, and robots file
- The static site is ready to deploy as-is
- If the self-hosted backend is needed in production, it must be deployed on a Node-capable environment and connected separately from the static cPanel copy flow

## Packaged deliverables

The repository root already contains packaged export artifacts for handoff and upload, including cPanel/dist zip bundles created during finalization. Those artifacts are intentionally ignored by Git via `.gitignore`, so the source repository stays clean while deliverables remain available in the workspace.

## Utility scripts

- `simple_server.ps1` and `start_server.ps1`: local static preview helpers
- `tools/prepare-country-images.js`: country image preparation utility
- `tools/verify-country-images.js`: country image verification utility
- `tools/generate-seo-files.js`: SEO helper script

## Final handoff summary

This repository now serves as the complete source handoff for Royal Visa Xpert: branded frontend, content pages, destination data, enquiry flow, deployment config, and optional backend are all present in one place.
