import { Logger, Module } from '@nestjs/common';
import { LawnMowerController } from './lawn-mower.controller';
import { LawnMowerService } from './services/lawn-mower.service';
import { ConversionService } from './services/conversion.service';
import { InputValidationService } from './services/input-validation.service';

@Module({
  imports: [],
  controllers: [LawnMowerController],
  providers: [
    Logger,
    LawnMowerService,
    ConversionService,
    InputValidationService,
  ],
})
export class LawnMowerModule {}
