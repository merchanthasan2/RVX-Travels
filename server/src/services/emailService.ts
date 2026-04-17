import net from 'net';
import tls from 'tls';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export interface InquiryData {
    name: string;
    email: string;
    phone?: string;
    visaType: string;
    destination: string;
    urgentService?: boolean;
    message: string;
    ip: string;
    sourcePage?: string;
}

interface SmtpMessage {
    to: string;
    subject: string;
    html: string;
    text: string;
}

const b64 = (value: string) => Buffer.from(value).toString('base64');
const CRLF = '\r\n';

function buildMime(from: string, to: string, subject: string, html: string, text: string): string {
    const boundary = crypto.randomBytes(12).toString('hex');

    return [
        `Date: ${new Date().toUTCString()}`,
        `From: "Royal Visa Xpert" <${from}>`,
        `To: ${to}`,
        `Subject: =?UTF-8?B?${b64(subject)}?=`,
        'MIME-Version: 1.0',
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        'Content-Type: text/plain; charset=UTF-8',
        '',
        text,
        '',
        `--${boundary}`,
        'Content-Type: text/html; charset=UTF-8',
        '',
        html,
        '',
        `--${boundary}--`
    ].join(CRLF);
}

function sendSmtp(message: SmtpMessage): Promise<void> {
    return new Promise((resolve, reject) => {
        const host = process.env.SMTP_HOST || 'smtp.gmail.com';
        const port = parseInt(process.env.SMTP_PORT || '587', 10);
        const user = process.env.SMTP_USER || '';
        const pass = process.env.SMTP_PASS || '';
        const from = process.env.MAIL_FROM || user;

        if (!user || !pass || !from) {
            reject(new Error('SMTP configuration is incomplete. Set SMTP_USER, SMTP_PASS, and MAIL_FROM.'));
            return;
        }

        const mime = buildMime(from, message.to, message.subject, message.html, message.text);

        let step = 0;
        let buffer = '';
        let tlsSocket: tls.TLSSocket | null = null;
        let settled = false;

        const finish = (error?: Error) => {
            if (settled) return;
            settled = true;

            try {
                plainSocket.destroy();
            } catch (destroyError) {
                // Ignore shutdown errors during cleanup.
            }

            if (error) {
                reject(error);
                return;
            }

            resolve();
        };

        const write = (command: string) => {
            const socket: net.Socket | tls.TLSSocket = tlsSocket ?? plainSocket;
            socket.write(command + CRLF);
        };

        const processData = (chunk: Buffer) => {
            buffer += chunk.toString('utf8');
            const lines = buffer.split(CRLF);
            buffer = lines.pop() ?? '';

            for (const line of lines) {
                if (!line.trim()) continue;
                handleLine(line);
            }
        };

        const handleLine = (line: string) => {
            const code = parseInt(line.slice(0, 3), 10);
            if (line[3] === '-') return;

            try {
                switch (step) {
                    case 0:
                        if (code === 220) {
                            step = 1;
                            write('EHLO client');
                        } else {
                            finish(new Error(`Greeting: ${line}`));
                        }
                        break;

                    case 1:
                        if (code === 250) {
                            step = 2;
                            write('STARTTLS');
                        } else {
                            finish(new Error(`EHLO: ${line}`));
                        }
                        break;

                    case 2:
                        if (code === 220) {
                            step = 3;
                            tlsSocket = tls.connect(
                                { socket: plainSocket, host, servername: host },
                                () => {
                                    step = 4;
                                    write('EHLO client');
                                    tlsSocket!.on('data', processData);
                                }
                            );
                            tlsSocket.on('error', finish);
                        } else {
                            finish(new Error(`STARTTLS: ${line}`));
                        }
                        break;

                    case 3:
                        break;

                    case 4:
                        if (code === 250) {
                            step = 5;
                            write('AUTH LOGIN');
                        } else {
                            finish(new Error(`TLS EHLO: ${line}`));
                        }
                        break;

                    case 5:
                        if (code === 334) {
                            step = 6;
                            write(b64(user));
                        } else {
                            finish(new Error(`AUTH LOGIN: ${line}`));
                        }
                        break;

                    case 6:
                        if (code === 334) {
                            step = 7;
                            write(b64(pass));
                        } else {
                            finish(new Error(`Username send: ${line}`));
                        }
                        break;

                    case 7:
                        if (code === 235) {
                            step = 8;
                            write(`MAIL FROM:<${from}>`);
                        } else {
                            finish(new Error(`Auth failed: ${line}`));
                        }
                        break;

                    case 8:
                        if (code === 250) {
                            step = 9;
                            write(`RCPT TO:<${message.to}>`);
                        } else {
                            finish(new Error(`MAIL FROM: ${line}`));
                        }
                        break;

                    case 9:
                        if (code === 250) {
                            step = 10;
                            write('DATA');
                        } else {
                            finish(new Error(`RCPT TO: ${line}`));
                        }
                        break;

                    case 10:
                        if (code === 354) {
                            step = 11;
                            write(mime + CRLF + '.');
                        } else {
                            finish(new Error(`DATA: ${line}`));
                        }
                        break;

                    case 11:
                        if (code === 250) {
                            step = 12;
                            write('QUIT');
                        } else {
                            finish(new Error(`Message send: ${line}`));
                        }
                        break;

                    case 12:
                        finish();
                        break;

                    default:
                        finish(new Error(`Unexpected state ${step}: ${line}`));
                        break;
                }
            } catch (error) {
                finish(error instanceof Error ? error : new Error(String(error)));
            }
        };

        const plainSocket = net.createConnection(port, host);
        plainSocket.setTimeout(20000);
        plainSocket.on('timeout', () => finish(new Error('SMTP timeout')));
        plainSocket.on('error', finish);
        plainSocket.on('data', (chunk: Buffer) => {
            if (step < 3) {
                processData(chunk);
            }
        });
    });
}

export const sendInquiryEmail = async (data: InquiryData): Promise<void> => {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const adminTo = process.env.MAIL_TO || 'info@rvxtravels.com';
    const urgencyLabel = data.urgentService ? 'Yes - priority requested' : 'No';
    const adminSubjectPrefix = data.urgentService ? 'Urgent Enquiry' : 'New Enquiry';
    const userUrgencyLine = data.urgentService
        ? '<p><strong>Urgent service requested:</strong> Yes. We will prioritize the review of your enquiry.</p>'
        : '';

    const adminHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#1e2a78;color:white;padding:24px;border-radius:8px 8px 0 0;">
    <h2 style="margin:0;">New Enquiry - Royal Visa Xpert</h2>
  </div>
  <div style="background:#f9fafb;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:bold;width:35%;">Name</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;">${data.name}</td></tr>
      <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:bold;">Email</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;">${data.email || 'Not provided'}</td></tr>
      <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:bold;">Phone</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;">${data.phone || 'Not provided'}</td></tr>
      <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:bold;">Destination</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;">${data.destination}</td></tr>
      <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:bold;">Service / Type</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;">${data.visaType}</td></tr>
      <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:bold;">Urgent Service</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;">${urgencyLabel}</td></tr>
      <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:bold;">Message</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;">${data.message || '-'}</td></tr>
      <tr><td style="padding:10px;border-bottom:1px solid #e5e7eb;font-weight:bold;">Source Page</td><td style="padding:10px;border-bottom:1px solid #e5e7eb;">${data.sourcePage || 'Unknown'}</td></tr>
      <tr><td style="padding:10px;font-weight:bold;">Submitted (IST)</td><td style="padding:10px;">${timestamp}</td></tr>
    </table>
    <div style="margin-top:24px;text-align:center;">
      <a href="mailto:${data.email}" style="background:#1e2a78;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Reply to Enquiry</a>
    </div>
  </div>
</div>`;

    const adminText = `New Enquiry
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Destination: ${data.destination}
Type: ${data.visaType}
Urgent Service: ${urgencyLabel}
Message: ${data.message}
Source Page: ${data.sourcePage || 'Unknown'}
Time (IST): ${timestamp}`;

    await sendSmtp({
        to: adminTo,
        subject: `${adminSubjectPrefix}: ${data.destination} - ${data.visaType}`,
        html: adminHtml,
        text: adminText
    });

    if (data.email && data.email.includes('@')) {
        const userHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#1e2a78;color:white;padding:24px;border-radius:8px 8px 0 0;">
    <h2 style="margin:0;">Royal Visa Xpert</h2>
  </div>
  <div style="padding:24px;">
    <p>Hi ${data.name},</p>
    <p>Thank you for reaching out to <strong>Royal Visa Xpert</strong>. We have received your enquiry regarding <strong>${data.visaType}</strong> for <strong>${data.destination}</strong>.</p>
    ${userUrgencyLine}
    <p>Our team will review your details and get back to you within <strong>one business day</strong>.</p>
    <p>For urgent queries, you can also reach us on WhatsApp: <a href="https://wa.me/919594960707">+91 95949 60707</a></p>
    <br><p>Best regards,<br><strong>Royal Visa Xpert Team</strong></p>
  </div>
</div>`;

        await sendSmtp({
            to: data.email,
            subject: `We received your enquiry for ${data.destination} - Royal Visa Xpert`,
            html: userHtml,
            text: `Hi ${data.name}, we received your enquiry for ${data.destination}.${data.urgentService ? ' You requested urgent service and we will prioritize the review.' : ''} We'll be in touch within one business day.`
        });
    }
};
