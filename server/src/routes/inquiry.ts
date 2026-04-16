import { Router, Request, Response } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { sendInquiryEmail } from '../services/emailService';
import fs from 'fs';
import path from 'path';

const router = Router();

// Rate Limiter: 5 requests per minute per IP
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { error: 'Too many requests, please try again later.' }
});

// Validation Schema (phone is optional — not collected on frontend)
const inquirySchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email().or(z.literal('')),
    phone: z.string().optional().default('Not provided'),
    visaType: z.string().min(1),
    destination: z.string().min(1),
    urgentService: z.boolean().optional().default(false),
    message: z.string().max(1000).optional().default(''),
    consent: z.boolean().optional().default(true),
    company: z.string().max(0).optional() // Honeypot: must be empty
});

// Logger
const logInquiry = (data: any) => {
    const logDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

    const maskedEmail = data.email ? data.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : 'N/A';

    const logEntry = {
        timestamp: new Date().toISOString(),
        destination: data.destination,
        visaType: data.visaType,
        urgentService: Boolean(data.urgentService),
        maskedEmail
    };

    fs.appendFileSync(path.join(logDir, 'inquiries.jsonl'), JSON.stringify(logEntry) + '\n');
};

router.post('/', limiter, async (req: Request, res: Response) => {
    try {
        // 1. Honeypot Check
        if (req.body.company) {
            console.warn(`Bot detected from IP: ${req.ip}`);
            return res.status(400).json({ error: 'Invalid submission' });
        }

        // 2. Validation
        const validatedData = inquirySchema.parse(req.body);

        // 3. Send Email
        await sendInquiryEmail({
            ...validatedData,
            ip: req.ip || 'Unknown'
        });

        // 4. Log (Masked)
        logInquiry(validatedData);

        res.status(200).json({ success: true, message: 'Inquiry received' });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation failed', details: error.errors });
        }
        console.error('Inquiry Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
