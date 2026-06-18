export function isTruthyEnv(value: string | undefined): boolean {
  if (!value) return false;

  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}

export function isRegistrationKillSwitchEnabled(): boolean {
  return isTruthyEnv(process.env.REGISTRATION_KILL_SWITCH);
}

export function getRegistrationKillSwitchMessage(): string {
  return (
    process.env.REGISTRATION_KILL_SWITCH_MESSAGE?.trim() ||
    'Registration is temporarily disabled. Please contact the help desk for assistance.'
  );
}

export function isNotificationEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM,
  );
}

export function isNotificationWhatsappConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_WHATSAPP_FROM,
  );
}

export function getDeploymentEnvStatus() {
  return [
    { key: 'DATABASE_URL', configured: Boolean(process.env.DATABASE_URL?.trim()) },
    { key: 'AUTH_SECRET', configured: Boolean(process.env.AUTH_SECRET?.trim()) },
    {
      key: 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
      configured: Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim()),
    },
    {
      key: 'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET',
      configured: Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim()),
    },
    {
      key: 'NEXT_PUBLIC_SITE_URL',
      configured: Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim()),
    },
  ];
}

export function getNotificationCapabilities() {
  return {
    email: isNotificationEmailConfigured(),
    whatsapp: isNotificationWhatsappConfigured(),
  };
}

export function hasAdminSetupKey(): boolean {
  return Boolean(process.env.ADMIN_SETUP_KEY?.trim());
}
