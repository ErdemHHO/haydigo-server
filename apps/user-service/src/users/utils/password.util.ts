import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { PASSWORD_HASH } from '../constants/users.constants';

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keyLength: number,
) => Promise<Buffer>;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(PASSWORD_HASH.saltLength);
  const key = await scryptAsync(password, salt, PASSWORD_HASH.keyLength);
  return [PASSWORD_HASH.scheme, salt.toString('hex'), key.toString('hex')].join(
    PASSWORD_HASH.separator,
  );
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [scheme, saltHex, keyHex] = storedHash.split(PASSWORD_HASH.separator);
  if (scheme !== PASSWORD_HASH.scheme || !saltHex || !keyHex) {
    return false;
  }
  const expected = Buffer.from(keyHex, 'hex');
  const actual = await scryptAsync(
    password,
    Buffer.from(saltHex, 'hex'),
    expected.length,
  );
  return timingSafeEqual(actual, expected);
}
