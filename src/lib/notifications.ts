import nodemailer from 'nodemailer';
import { isNotificationEmailConfigured, isNotificationWhatsappConfigured } from './env';

type NotificationCampaignInput = {
  subject: string;
  message: string;
  emails: string[];
  phones: string[];
  sendEmail: boolean;
  sendWhatsapp: boolean;
};

type NotificationCampaignResult = {
  emailSent: number;
  whatsappSent: number;
  failures: string[];
};

function dedupe(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function normalizePhoneNumber(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, '');

  if (!cleaned) return null;
  if (cleaned.startsWith('+')) return cleaned;
  if (cleaned.startsWith('91') && cleaned.length >= 12) return `+${cleaned}`;
  if (cleaned.length === 10) return `+91${cleaned}`;

  return `+${cleaned}`;
}

async function sendEmailCampaign(subject: string, message: string, recipients: string[]) {
  if (!isNotificationEmailConfigured() || recipients.length === 0) {
    return { sent: 0, failures: [] as string[] };
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_FROM,
      bcc: recipients,
      subject,
      text: message,
      html: `<div style="font-family: Arial, sans-serif; white-space: pre-line;">${message}</div>`,
    });

    return { sent: recipients.length, failures: [] as string[] };
  } catch (error) {
    const failureMessage = error instanceof Error ? error.message : 'Unknown email delivery failure.';
    return { sent: 0, failures: [`Email delivery failed: ${failureMessage}`] };
  }
}

async function sendWhatsappCampaign(message: string, recipients: string[]) {
  if (!isNotificationWhatsappConfigured() || recipients.length === 0) {
    return { sent: 0, failures: [] as string[] };
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
  const authToken = process.env.TWILIO_AUTH_TOKEN as string;
  const from = process.env.TWILIO_WHATSAPP_FROM as string;
  const authHeader = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  let sent = 0;
  const failures: string[] = [];

  for (const recipient of recipients) {
    const body = new URLSearchParams({
      To: `whatsapp:${recipient}`,
      From: from,
      Body: message,
    });

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      failures.push(`WhatsApp delivery failed for ${recipient}: ${errorText}`);
      continue;
    }

    sent += 1;
  }

  return { sent, failures };
}

export async function sendNotificationCampaign({
  subject,
  message,
  emails,
  phones,
  sendEmail,
  sendWhatsapp,
}: NotificationCampaignInput): Promise<NotificationCampaignResult> {
  const uniqueEmails = dedupe(emails);
  const uniquePhones = dedupe(phones.map((phone) => normalizePhoneNumber(phone) || '')).filter(Boolean);

  const emailResult =
    sendEmail && uniqueEmails.length > 0
      ? await sendEmailCampaign(subject, message, uniqueEmails)
      : { sent: 0, failures: [] as string[] };

  const whatsappResult =
    sendWhatsapp && uniquePhones.length > 0
      ? await sendWhatsappCampaign(message, uniquePhones)
      : { sent: 0, failures: [] as string[] };

  return {
    emailSent: emailResult.sent,
    whatsappSent: whatsappResult.sent,
    failures: [...emailResult.failures, ...whatsappResult.failures],
  };
}
