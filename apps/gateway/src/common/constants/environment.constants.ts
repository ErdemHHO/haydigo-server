export const ENVIRONMENT_DEFAULTS = {
  port: 3000,
  jwtExpiresIn: '1h',
} as const;

export const ENVIRONMENT_LIMITS = {
  maxPort: 65535,
  jwtSecretMinLength: 32,
} as const;
