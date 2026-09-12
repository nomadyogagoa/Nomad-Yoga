export type Environment = 'development' | 'test' | 'production';

const environments: readonly Environment[] = ['development', 'test', 'production'];

export function validateEnvironment(config: Record<string, unknown>): Record<string, unknown> {
  const nodeEnv = config.NODE_ENV ?? 'development';
  if (typeof nodeEnv !== 'string' || !environments.includes(nodeEnv as Environment)) {
    throw new Error('NODE_ENV must be development, test, or production.');
  }

  const port = Number(config.PORT ?? 4000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  if (typeof config.DATABASE_URL !== 'string' || config.DATABASE_URL.trim().length === 0) {
    throw new Error('DATABASE_URL is required to start the API.');
  }
  if (typeof config.DATABASE_CA_CERT_PATH !== 'string' || config.DATABASE_CA_CERT_PATH.trim().length === 0) {
    throw new Error('DATABASE_CA_CERT_PATH is required to start the API.');
  }

  if (typeof config.FRONTEND_URL !== 'string') {
    throw new Error('FRONTEND_URL is required to start the API.');
  }
  try {
    new URL(config.FRONTEND_URL);
  } catch {
    throw new Error('FRONTEND_URL must be a valid URL.');
  }
  if (config.FRONTEND_URLS !== undefined && config.FRONTEND_URLS !== '') {
    const origins = String(config.FRONTEND_URLS).split(',').map((origin) => origin.trim()).filter(Boolean);
    if (!origins.length) throw new Error('FRONTEND_URLS must contain at least one URL.');
    for (const origin of origins) { try { new URL(origin); } catch { throw new Error('FRONTEND_URLS must be a comma-separated list of valid URLs.'); } }
  }

  const jwtSecret = config.JWT_ACCESS_SECRET;
  if (typeof jwtSecret !== 'string' || jwtSecret.trim().length < 32) {
    throw new Error('JWT_ACCESS_SECRET must be at least 32 characters.');
  }
  if (nodeEnv === 'production' && /change|example|secret/i.test(jwtSecret)) {
    throw new Error('JWT_ACCESS_SECRET must not be a default or example value in production.');
  }
  for (const key of ['REFRESH_TOKEN_EXPIRES_DAYS', 'EMAIL_VERIFICATION_EXPIRES_MINUTES', 'PASSWORD_RESET_EXPIRES_MINUTES']) {
    const value = Number(config[key] ?? (key === 'REFRESH_TOKEN_EXPIRES_DAYS' ? 30 : 60));
    if (!Number.isInteger(value) || value < 1 || value > 365) throw new Error(`${key} must be a whole number between 1 and 365.`);
    config[key] = value;
  }
  if (config.SMTP_PORT !== undefined && config.SMTP_PORT !== '') {
    const smtpPort = Number(config.SMTP_PORT);
    if (!Number.isInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535) throw new Error('SMTP_PORT must be a valid port number.');
    config.SMTP_PORT = smtpPort;
  }
  const emailProvider = config.EMAIL_PROVIDER ?? 'resend';
  if (emailProvider !== 'resend' && emailProvider !== 'smtp') throw new Error('EMAIL_PROVIDER must be resend or smtp.');
  config.EMAIL_PROVIDER = emailProvider;
  if (config.SMTP_SECURE !== undefined && config.SMTP_SECURE !== '') {
    if (!['true', 'false', true, false].includes(config.SMTP_SECURE as never)) throw new Error('SMTP_SECURE must be true or false.');
    config.SMTP_SECURE = config.SMTP_SECURE === true || config.SMTP_SECURE === 'true';
  }
  const gateway = config.PAYMENT_GATEWAY ?? 'cashfree';
  if (gateway !== 'cashfree' && gateway !== 'stripe') throw new Error('PAYMENT_GATEWAY must be cashfree or stripe.');
  config.PAYMENT_GATEWAY = gateway;
  for (const key of ['PAYMENT_SUCCESS_URL', 'PAYMENT_CANCEL_URL']) {
    if (config[key] !== undefined && config[key] !== '') { try { new URL(String(config[key])); } catch { throw new Error(`${key} must be a valid URL.`); } }
  }
  for (const key of ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']) {
    if (config[key] !== undefined && config[key] !== '' && typeof config[key] !== 'string') throw new Error(`${key} must be a string.`);
  }
  if (config.CLOUDINARY_FOLDER !== undefined && config.CLOUDINARY_FOLDER !== '' && (typeof config.CLOUDINARY_FOLDER !== 'string' || !/^[a-zA-Z0-9_\-/]{1,120}$/.test(config.CLOUDINARY_FOLDER))) throw new Error('CLOUDINARY_FOLDER must be a bounded path.');

  return { ...config, NODE_ENV: nodeEnv, PORT: port };
}
