import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class InputValidationService {
  validate(dataArray: string[]) {
    if (
      dataArray == null ||
      dataArray.length < 3 ||
      dataArray.length % 2 == 0
    ) {
      throw new BadRequestException('Insufficient input');
    }
  }
}
