import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import inquiryRoutes from './routes/inquiry';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware — CSP tuned to allow CDN assets the frontend depends on
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'",          // data.js / main.js inline usage
                    "https://unpkg.com",         // Lucide icons CDN
                ],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://fonts.googleapis.com",
                ],
                fontSrc: [
                    "'self'",
                    "https://fonts.gstatic.com",
                ],
                imgSrc: [
                    "'self'",
                    "data:",
                    "https://images.unsplash.com",  // Country card & hero images
                    "https://*.unsplash.com",
                    "https://upload.wikimedia.org", // Country card & hero images
                    "https://*.wikimedia.org",
                ],
                connectSrc: [
                    "'self'",
                    "https://geocoding-api.open-meteo.com",
                    "https://api.open-meteo.com",
                    "https://api.waqi.info",
                    "https://ipapi.co",
                    "https://api.web3forms.com",
                ],
                frameSrc: ["'none'"],
                objectSrc: ["'none'"],
            },
        },
        crossOriginEmbedderPolicy: false,
    })
);
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || '*', // Lock to origin in prod
    methods: ['POST']
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use('/api/inquiry', inquiryRoutes);

import path from 'path';
// Serve static frontend files
app.use(express.static(path.join(__dirname, '../../')));

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', env: process.env.APP_ENV });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.APP_ENV} mode`);
});
