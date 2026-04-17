import { Router, Request, Response } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { sendInquiryEmail } from '../services/emailService';
import fs from 'fs';
import path from 'path';

const router = Router();

const booleanField = (defaultValue: boolean) =>
    z.preprocess((value) => {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
            const normalized = value.trim().toLowerCase();
            return normalized === 'true' || normalized === '1' || normalized === 'on' || normalized === 'yes';
        }
        return defaultValue;
    }, z.boolean()).optional().default(defaultValue);

// Rate limiter: 5 requests per minute per IP
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { error: 'Too many requests, please try again later.' }
});

const inquirySchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email().or(z.literal('')),
    phoneCountryCode: z.string().min(1).optional().default('+91'),
    mobileNumber: z.string().regex(/^\d{6,15}$/).optional().default(''),
    phone: z.string().optional().default(''),
    visaType: z.string().min(1),
    destination: z.string().min(1),
    urgentService: booleanField(false),
    message: z.string().max(1000).optional().default(''),
    consent: booleanField(true),
    company: z.string().max(0).optional(),
    sourcePage: z.string().max(120).optional().default('')
});

const logInquiry = (data: z.infer<typeof inquirySchema>) => {
    const logDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

    const maskedEmail = data.email ? data.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : 'N/A';

    const logEntry = {
        timestamp: new Date().toISOString(),
        destination: data.destination,
        visaType: data.visaType,
        urgentService: Boolean(data.urgentService),
        sourcePage: data.sourcePage || 'unknown',
        maskedEmail
    };

    fs.appendFileSync(path.join(logDir, 'inquiries.jsonl'), JSON.stringify(logEntry) + '\n');
};

router.post('/', limiter, async (req: Request, res: Response) => {
    try {
        if (req.body.company) {
            console.warn(`Bot detected from IP: ${req.ip}`);
            return res.status(400).json({ error: 'Invalid submission' });
        }

        const validatedData = inquirySchema.parse(req.body);
        const normalizedPhone = validatedData.phone || `${validatedData.phoneCountryCode}${validatedData.mobileNumber}` || 'Not provided';

        await sendInquiryEmail({
            ...validatedData,
            phone: normalizedPhone,
            ip: req.ip || 'Unknown'
        });

        logInquiry(validatedData);

        return res.status(200).json({ success: true, message: 'Inquiry received' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation failed', details: error.errors });
        }

        console.error('Inquiry Error:', error);
        return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
    }
});

export default router;
