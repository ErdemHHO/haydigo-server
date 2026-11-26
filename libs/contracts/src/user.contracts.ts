export const USER_PATTERNS = {
  register: 'user.register',
  verifyCredentials: 'user.verify-credentials',
  findById: 'user.find-by-id',
} as const;

export const USER_LIMITS = {
  emailMaxLength: 320,
  passwordMinLength: 8,
  passwordMaxLength: 128,
  fullNameMinLength: 2,
  fullNameMaxLength: 120,
} as const;

export interface RegisterUserPayload {
  email: string;
  password: string;
  fullName: string;
}

export interface VerifyCredentialsPayload {
  email: string;
  password: string;
}

export interface FindUserByIdPayload {
  id: string;
}

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}
