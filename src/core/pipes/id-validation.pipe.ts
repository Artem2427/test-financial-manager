import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import validator from 'validator';
import { INVALID_ID_FORMAT } from '../errors/errors';

@Injectable()
export class IdValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') {
      return value;
    }

    if (!validator.isUUID(value, 'all')) {
      throw new BadRequestException(INVALID_ID_FORMAT);
    }

    return value;
  }
}
