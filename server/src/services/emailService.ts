/**
 * emailService.ts
 * Pure Node.js SMTP client — no external packages required.
 * Uses the built-in `net` and `tls` modules with STARTTLS on port 587.
 */
import net from 'net';
import tls from 'tls';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// ─── Types ───────────────────────────────────────────────────────────────────

export interface InquiryData {
    name: string;
    email: string;
    phone?: string;
    visaType: string;
    destination: string;
    message: string;
    ip: string;
}

interface SmtpMessage {
    to: string;
    subject: string;
    html: string;
    text: string;
}

// ─── SMTP Client ─────────────────────────────────────────────────────────────

const b64 = (s: string) => Buffer.from(s).toString('base64');
const CRLF = '\r\n';

function buildMime(from: string, to: string, subject: string, html: string, text: string): string {
    const id = crypto.randomBytes(12).toString('hex');
    return [
        `Date: ${new Date().toUTCString()}`,
        `From: "Royal Visa Xpert" <${from}>`,
        `To: ${to}`,
        `Subject: =?UTF-8?B?${b64(subject)}?=`,
        `MIME-Version: 1.0`,
        `Content-Type: multipart/alternative; boundary="${id}"`,
        ``,
        `--${id}`,
        `Content-Type: text/plain; charset=UTF-8`,
        ``,
        text,
        ``,
        `--${id}`,
        `Content-Type: text/html; charset=UTF-8`,
        ``,
        html,
        ``,
        `--${id}--`,
    ].join(CRLF);
}

function sendSmtp(msg: SmtpMessage): Promise<void> {
    return new Promise((resolve, reject) => {
        const host = process.env.SMTP_HOST || 'smtp.gmail.com';
        const port = parseInt(process.env.SMTP_PORT || '587', 10);
        const user = process.env.SMTP_USER || '';
        const pass = process.env.SMTP_PASS || '';
        const from = process.env.MAIL_FROM || user;

        const mime = buildMime(from, msg.to, msg.subject, msg.html, msg.text);

        let step = 0;
        let buf = '';
        let tlsSock: tls.TLSSocket | null = null;
        let settled = false;

        const done = (err?: Error) => {
            if (settled) return;
            settled = true;
            try { plainSock.destroy(); } catch (_) {}
            err ? reject(err) : resolve();
        };

        const write = (cmd: string) => {
            const sock: net.Socket | tls.TLSSocket = tlsSock ?? plainSock;
            sock.write(cmd + CRLF);
        };

        const handleLine = (line: string) => {
            if (!line.trim()) return;
            const code = parseInt(line.slice(0, 3), 10);
            if (line[3] === '-') return; // Multiline continuation — wait for last line

            try {
                switch (step) {
                    case 0: // 220 greeting
                        if (code === 220) { step = 1; write('EHLO client'); }
                        else done(new Error(`Greeting: ${line}`));
                        break;

                    case 1: // 250 EHLO capabilities
                        if (code === 250) { step = 2; write('STARTTLS'); }
                        else done(new Error(`EHLO: ${line}`));
                        break;

                    case 2: // 220 ready for TLS
                        if (code === 220) {
                            step = 3; // Transitioning — pause plain socket reading
                            tlsSock = tls.connect(
                                { socket: plainSock, host, servername: host },
                                () => {
                                    step = 4;
                                    write('EHLO client'); // Re-EHLO over TLS
                                    tlsSock!.on('data', (d: Buffer) => processData(d));
                                }
                            );
                            tlsSock.on('error', (e) => done(e));
                        } else done(new Error(`STARTTLS: ${line}`));
                        break;

                    case 3: break; // TLS handshake in progress

                    case 4: // 250 EHLO over TLS
                        if (code === 250) { step = 5; write('AUTH LOGIN'); }
                        else done(new Error(`TLS EHLO: ${line}`));
                        break;

                    case 5: // 334 username prompt
                        if (code === 334) { step = 6; write(b64(user)); }
                        else done(new Error(`AUTH LOGIN: ${line}`));
                        break;

                    case 6: // 334 password prompt
                        if (code === 334) { step = 7; write(b64(pass)); }
                        else done(new Error(`Username send: ${line}`));
                        break;

                    case 7: // 235 auth success
                        if (code === 235) { step = 8; write(`MAIL FROM:<${from}>`); }
                        else done(new Error(`Auth failed (wrong credentials?): ${line}`));
                        break;

                    case 8: // 250 MAIL FROM
                        if (code === 250) { step = 9; write(`RCPT TO:<${msg.to}>`); }
                        else done(new Error(`MAIL FROM: ${line}`));
                        break;

                    case 9: // 250 RCPT TO
                        if (code === 250) { step = 10; write('DATA'); }
                        else done(new Error(`RCPT TO: ${line}`));
                        break;

                    case 10: // 354 start input
                        if (code === 354) { step = 11; write(mime + CRLF + '.'); }
                        else done(new Error(`DATA: ${line}`));
                        break;

                    case 11: // 250 message accepted
                        if (code === 250) { step = 12; write('QUIT'); }
                        else done(new Error(`Message send: ${line}`));
                        break;

                    case 12: // 221 goodbye
                        done();
                        break;

                    default:
                        done(new Error(`Unexpected state ${step}: ${line}`));
                }
            } catch (err: any) {
                done(err);
            }
        };

        const processData = (d: Buffer) => {
            buf += d.toString('utf8');
            const lines = buf.split('\r\n');
            buf = lines.pop() ?? '';
            for (const line of lines) {
                if (line) handleLine(line);
            }
        };

        // Create plain TCP connection first (STARTTLS begins as plaintext on 587)
        const plainSock = net.createConnection(port, host);
        plainSock.setTimeout(20000);
        plainSock.on('timeout', () => done(new Error('SMTP timeout')));
        plainSock.on('error', (e) => done(e));
        plainSock.on('data', (d: Buffer) => {
            if (step < 3) processData(d); // Pre-TLS only
        });
    });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const sendInquiryEmail = async (data: InquiryData): Promise<void> => {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const adminTo  = process.env.MAIL_TO || 'info@rvxtravels.com';

    // ── Admin notification ──────────────────────────────────────────
    const adminHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#1e2a78;color:white;padding:24px;border-radius:8px 8px 0 0;">
    <h2 style="margin:0;">📩 New Enquiry — Royal Visa Xpert</h2>
  </div>
  <div style="background:#f9fafb;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:bold;width:35%;">Name</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;">${data.name}</td></tr>
      <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:bold;">Email</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;">${data.email || 'Not provided'}</td></tr>
      <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:bold;">Destination</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;">${data.destination}</td></tr>
      <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:bold;">Service / Type</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;">${data.visaType}</td></tr>
      <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:bold;">Message</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;">${data.message || '—'}</td></tr>
      <tr><td style="padding:10px;font-weight:bold;">Submitted (IST)</td><td style="padding:10px;">${timestamp}</td></tr>
    </table>
    <div style="margin-top:24px;text-align:center;">
      <a href="mailto:${data.email}" style="background:#1e2a78;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Reply to Enquiry</a>
    </div>
  </div>
</div>`;

    const adminText = `New Enquiry\nName: ${data.name}\nEmail: ${data.email}\nDestination: ${data.destination}\nType: ${data.visaType}\nMessage: ${data.message}\nTime (IST): ${timestamp}`;

    // ── Send admin notification ─────────────────────────────────────
    await sendSmtp({ to: adminTo, subject: `New Enquiry: ${data.destination} — ${data.visaType}`, html: adminHtml, text: adminText });
    console.log(`✅ Admin email sent to ${adminTo}`);

    // ── User auto-acknowledgement (only if email provided) ──────────
    if (data.email && data.email.includes('@')) {
        const userHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#1e2a78;color:white;padding:24px;border-radius:8px 8px 0 0;">
    <h2 style="margin:0;">Royal Visa Xpert</h2>
  </div>
  <div style="padding:24px;">
    <p>Hi ${data.name},</p>
    <p>Thank you for reaching out to <strong>Royal Visa Xpert</strong>. We have received your enquiry regarding <strong>${data.visaType}</strong> for <strong>${data.destination}</strong>.</p>
    <p>Our team will review your details and get back to you within <strong>one business day</strong>.</p>
    <p>For urgent queries, you can also reach us on WhatsApp: <a href="https://wa.me/919833456675">+91 98334 56675</a></p>
    <br><p>Best regards,<br><strong>Royal Visa Xpert Team</strong></p>
  </div>
</div>`;

        await sendSmtp({
            to: data.email,
            subject: `We received your enquiry for ${data.destination} — Royal Visa Xpert`,
            html: userHtml,
            text: `Hi ${data.name}, we received your enquiry for ${data.destination}. We'll be in touch within one business day.`
        });
        console.log(`✅ Ack email sent to ${data.email}`);
    }
};
