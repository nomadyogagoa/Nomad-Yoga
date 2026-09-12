import { validateEnvironment } from './environment.validation';

const valid = () => ({ NODE_ENV: 'production', PORT: '4000', DATABASE_URL: 'postgresql://user:password@localhost:5432/nomad_yoga', DATABASE_CA_CERT_PATH: 'certs/database-ca.crt', FRONTEND_URL: 'https://app.nomadyoga.example', JWT_ACCESS_SECRET: 'a-unique-production-jwt-secret-that-is-long-enough' });

describe('validateEnvironment', () => {
  it('rejects an example-like production JWT secret', () => {
    expect(() => validateEnvironment({ ...valid(), JWT_ACCESS_SECRET: 'example-secret-that-is-long-enough-to-pass-length' })).toThrow('JWT_ACCESS_SECRET must not be a default or example value in production.');
  });

  it('rejects malformed configured CORS origins', () => {
    expect(() => validateEnvironment({ ...valid(), FRONTEND_URLS: 'https://app.nomadyoga.example,not a url' })).toThrow('FRONTEND_URLS must be a comma-separated list of valid URLs.');
  });

  it('requires a database CA certificate path', () => {
    expect(() => validateEnvironment({ ...valid(), DATABASE_CA_CERT_PATH: '' })).toThrow('DATABASE_CA_CERT_PATH is required to start the API.');
  });
});
