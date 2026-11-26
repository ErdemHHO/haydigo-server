import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export function createEnvironmentValidator<T extends object>(
  environmentClass: ClassConstructor<T>,
): (config: Record<string, unknown>) => T {
  return (config) => {
    const environment = plainToInstance(environmentClass, config, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(environment, { skipMissingProperties: false });
    if (errors.length > 0) {
      const problems = errors
        .flatMap((error) => Object.values(error.constraints ?? {}))
        .join('; ');
      throw new Error(`Invalid environment: ${problems}`);
    }
    return environment;
  };
}
