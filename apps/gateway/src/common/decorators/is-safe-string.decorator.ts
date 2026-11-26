import { ValidateBy, ValidationOptions, buildMessage } from 'class-validator';
import { SAFE_STRING } from '../constants/validation.constants';

export interface SafeStringOptions {
  allowNewlines?: boolean;
}

export function isSafeString(
  value: unknown,
  options: SafeStringOptions = {},
): boolean {
  if (typeof value !== 'string') {
    return false;
  }
  const pattern = options.allowNewlines
    ? SAFE_STRING.multiLinePattern
    : SAFE_STRING.singleLinePattern;
  return (
    pattern.test(value) &&
    !SAFE_STRING.forbiddenSequences.some((sequence) => value.includes(sequence))
  );
}

export function IsSafeString(
  options: SafeStringOptions = {},
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'isSafeString',
      constraints: [options],
      validator: {
        validate: (value: unknown): boolean => isSafeString(value, options),
        defaultMessage: buildMessage(
          (eachPrefix) =>
            `${eachPrefix}$property contains characters that are not allowed`,
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
