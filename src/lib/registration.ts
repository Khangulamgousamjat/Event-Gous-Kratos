export const PAYMENT_SCREENSHOT_MAX_BYTES = 5 * 1024 * 1024;

export const PAYMENT_SCREENSHOT_ALLOWED_FORMATS = ['jpg', 'jpeg', 'png'] as const;

export type PaymentScreenshotFormat = (typeof PAYMENT_SCREENSHOT_ALLOWED_FORMATS)[number];

export type PaymentScreenshotUpload = {
  bytes: number;
  format: string;
  url: string;
};

export type RegistrationMemberInput = {
  branch: string;
  college: string;
  email?: string;
  name: string;
  phone: string;
  year: string;
};

export type RegistrationSubmission = {
  eventId: string;
  members: RegistrationMemberInput[];
  paymentScreenshot?: PaymentScreenshotUpload | null;
  teamFormat: boolean;
  teamName?: string;
  transactionId?: string;
};

export function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function normalizeOptionalText(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = normalizeText(value);
  return normalized.length > 0 ? normalized : null;
}

export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }

  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }

  return digits;
}

export function getPhoneCandidates(value: string): string[] {
  const trimmed = value.trim();
  const normalized = normalizePhone(value);
  const candidates = new Set<string>();

  if (trimmed) {
    candidates.add(trimmed);
  }

  if (normalized) {
    candidates.add(normalized);
    candidates.add(`+91${normalized}`);
    candidates.add(`91${normalized}`);
    candidates.add(`0${normalized}`);
  }

  return [...candidates];
}

export function isValidPhone(value: string): boolean {
  return normalizePhone(value).length === 10;
}

export function normalizeTransactionId(value: string): string {
  return value.trim().replace(/\s+/g, '').toUpperCase();
}

export function parseYear(value: string): number | null {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export function getEventParticipationOptions(format: string | null | undefined) {
  switch (format) {
    case 'TEAM':
      return { allowTeam: true, requireTeam: true };
    case 'SOLO_TEAM':
    case 'SOLO_PAIR':
      return { allowTeam: true, requireTeam: false };
    default:
      return { allowTeam: false, requireTeam: false };
  }
}

export function getEventMinParticipants(
  format: string | null | undefined,
  teamSizeMin: number | null | undefined,
  teamMode: boolean,
): number {
  const baseMin = Math.max(teamSizeMin ?? 1, 1);

  if (!teamMode) {
    return 1;
  }

  return Math.max(baseMin, getEventParticipationOptions(format).requireTeam ? baseMin : 2);
}

export function getEventMaxParticipants(teamSize: number | null | undefined): number {
  return Math.max(teamSize ?? 1, 1);
}

export function resolvePerParticipantFee(eventFee: number, feePerPerson: number | null | undefined): number {
  if (eventFee <= 0) {
    return 0;
  }

  if (feePerPerson && feePerPerson > 0) {
    return feePerPerson;
  }

  return eventFee;
}

export function isAllowedPaymentScreenshotFormat(format: string | null | undefined): format is PaymentScreenshotFormat {
  if (!format) {
    return false;
  }

  return PAYMENT_SCREENSHOT_ALLOWED_FORMATS.includes(format.toLowerCase() as PaymentScreenshotFormat);
}
