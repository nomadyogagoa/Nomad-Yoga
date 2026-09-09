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

  if (typeof config.FRONTEND_URL !== 'string') {
    throw new Error('FRONTEND_URL is required to start the API.');
  }
  try {
    new URL(config.FRONTEND_URL);
  } catch {
    throw new Error('FRONTEND_URL must be a valid URL.');
  }

  return { ...config, NODE_ENV: nodeEnv, PORT: port };
}
