const nodemailer = require('nodemailer');
const { getEnv } = require('../config/env');
const { logger } = require('../utils/logger');

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  const env = getEnv();
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth:
      env.SMTP_USER && env.SMTP_PASS
        ? {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          }
        : undefined,
  });
  return transporter;
}

/**
 * @param {{ to: string, subject: string, text: string, html?: string }} opts
 */
async function sendMail(opts) {
  const env = getEnv();
  if (!env.SMTP_USER && !env.SMTP_PASS) {
    logger.warn('SMTP credentials empty; skipping send', { to: opts.to, subject: opts.subject });
    return { skipped: true };
  }
  const t = getTransporter();
  await t.sendMail({
    from: env.SMTP_USER || 'no-reply@localhost',
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });
  return { skipped: false };
}

module.exports = { sendMail };
