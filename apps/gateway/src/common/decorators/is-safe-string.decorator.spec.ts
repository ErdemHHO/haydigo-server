import { validate } from 'class-validator';
import { IsSafeString, isSafeString } from './is-safe-string.decorator';

class ExampleDto {
  @IsSafeString()
  name: string;

  @IsSafeString({ allowNewlines: true })
  description: string;
}

async function errorsFor(dto: Partial<ExampleDto>): Promise<string[]> {
  const errors = await validate(Object.assign(new ExampleDto(), dto), {
    skipMissingProperties: true,
  });
  return errors.flatMap((error) => Object.values(error.constraints ?? {}));
}

describe('isSafeString', () => {
  it.each([
    'Kahve Durağı',
    'Çiğköfteci Şükrü & Oğulları',
    "D'Angelo's Pizza",
    'Café "Le Gourmet" #2',
    'Moda, Kadıköy / İstanbul',
    'Açık: 09:00 (hafta içi) - %20 indirim!',
    'user@example.com',
    '',
  ])('accepts %p', (value) => {
    expect(isSafeString(value)).toBe(true);
  });

  it.each([
    ['an HTML tag', '<div>Kahve</div>'],
    ['a script tag', '<script>alert(1)</script>'],
    ['an event handler', '" onmouseover="alert(1)'],
    ['a classic SQL injection', "' OR '1'='1"],
    ['a stacked SQL query', "x'; DROP TABLE users; --"],
    ['a SQL line comment', 'admin --'],
    ['a SQL block comment', 'a /* b */ c'],
    ['a template expression', '${process.env.JWT_SECRET}'],
    ['a backtick', '`whoami`'],
    ['a null byte', 'abc\u0000'],
    ['a zero-width space', 'ab​c'],
    ['a newline in a single-line field', 'line one\nline two'],
    ['a non-string value', 42],
  ])('rejects %s', (_, value) => {
    expect(isSafeString(value)).toBe(false);
  });

  it('accepts newlines only where allowed', () => {
    expect(isSafeString('Satır bir\nSatır iki', { allowNewlines: true })).toBe(
      true,
    );
    expect(isSafeString('<b>\nkalın</b>', { allowNewlines: true })).toBe(false);
  });
});

describe('@IsSafeString()', () => {
  it('passes a safe DTO', async () => {
    await expect(
      errorsFor({ name: 'Kahve Durağı', description: 'Satır bir\nSatır iki' }),
    ).resolves.toEqual([]);
  });

  it('names the property that failed', async () => {
    await expect(errorsFor({ name: '<div>' })).resolves.toEqual([
      'name contains characters that are not allowed',
    ]);
  });
});
