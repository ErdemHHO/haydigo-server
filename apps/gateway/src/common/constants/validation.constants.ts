const SAFE_PUNCTUATION = String.raw` .,'"!?:()&\-_\/@#%+*’‘“”`;

export const SAFE_STRING = {
  singleLinePattern: new RegExp(
    String.raw`^[\p{L}\p{M}\p{N}${SAFE_PUNCTUATION}]*$`,
    'u',
  ),
  multiLinePattern: new RegExp(
    String.raw`^[\p{L}\p{M}\p{N}${SAFE_PUNCTUATION}\r\n]*$`,
    'u',
  ),
  forbiddenSequences: ['--', '/*', '*/'],
} as const;
