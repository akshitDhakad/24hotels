import nodemailer from "nodemailer";
import twilio from "twilio";

import { env } from "@/lib/legacy-server/config/env";
import { logger } from "@/lib/legacy-server/config/logger";

export async function sendEmailOtp(toEmail: string, otp: string) {
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to: toEmail,
    subject: "Your verification code",
    text: `Your verification code is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;line-height:1.5">
        <h2 style="margin:0 0 8px">Verify your email</h2>
        <p style="margin:0 0 16px">Use this code to verify your email. It expires in <b>10 minutes</b>.</p>
        <div style="font-size:28px;letter-spacing:6px;font-weight:700;padding:12px 16px;border:1px solid rgba(0,0,0,.1);border-radius:12px;display:inline-block">
          ${otp}
        </div>
        <p style="margin:16px 0 0;color:#555;font-size:12px">If you didn’t request this, you can ignore this email.</p>
      </div>
    `,
  });
}

export async function sendSmsOtp(toPhoneE164: string, otp: string) {
  const sid = env.TWILLIO_ACCOUNT_SID;
  const token = env.TWILLIO_AUTH_TOKEN;
  const from = env.TWILLIO_PHONE_NUMBER;
  if (!sid || !token || !from) {
    logger.warn({ hasSid: !!sid, hasToken: !!token, hasFrom: !!from }, "Twilio env missing");
    throw new Error("SMS provider is not configured");
  }

  const client = twilio(sid, token);
  await client.messages.create({
    from,
    to: toPhoneE164,
    body: `Your verification code is ${otp}. It expires in 10 minutes.`,
  });
}

