import { hashPassword, verifyPassword } from './password.util';

describe('password', () => {
  it('verifies the password it hashed', async () => {
    const hash = await hashPassword('correct horse');
    await expect(verifyPassword('correct horse', hash)).resolves.toBe(true);
  });

  it('rejects a different password', async () => {
    const hash = await hashPassword('correct horse');
    await expect(verifyPassword('wrong horse', hash)).resolves.toBe(false);
  });

  it('salts each hash', async () => {
    expect(await hashPassword('same')).not.toBe(await hashPassword('same'));
  });

  it('rejects a malformed stored hash', async () => {
    await expect(verifyPassword('x', 'not-a-hash')).resolves.toBe(false);
  });
});
