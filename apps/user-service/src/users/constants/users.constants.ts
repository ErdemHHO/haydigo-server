export const USER_MESSAGES = {
  emailAlreadyRegistered: 'Bu e-posta adresi zaten kayıtlı',
  notFound: 'Kullanıcı bulunamadı',
} as const;

export const PASSWORD_HASH = {
  scheme: 'scrypt',
  separator: '$',
  saltLength: 16,
  keyLength: 64,
} as const;
