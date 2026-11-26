import { SetMetadata } from '@nestjs/common';
import { METADATA_KEYS } from '../constants/metadata.constants';

export const ResponseMessage = (message: string): MethodDecorator =>
  SetMetadata(METADATA_KEYS.responseMessage, message);
