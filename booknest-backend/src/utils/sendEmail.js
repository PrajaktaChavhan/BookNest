import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transporter = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT) || 587,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    })
  : null;

export async function sendEmail({ to, subject, html }) {
  if (!transporter) {
    // In local dev without SMTP configured, log instead of failing the request.
    console.log(`[email skipped - no SMTP configured] To: ${to} | Subject: ${subject}`);
    return;
  }
  await transporter.sendMail({ from: env.EMAIL_FROM, to, subject, html });
}
