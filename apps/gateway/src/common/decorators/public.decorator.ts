import { SetMetadata } from '@nestjs/common';
import { METADATA_KEYS } from '../constants/metadata.constants';

export const Public = (): MethodDecorator & ClassDecorator =>
  SetMetadata(METADATA_KEYS.isPublic, true);
