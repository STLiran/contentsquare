import { Controller, Logger, Post, Req } from '@nestjs/common';
import { LawnMowerService } from './services/lawn-mower.service';
import * as rawbody from 'raw-body';
import { InputValidationService } from './services/input-validation.service';

@Controller('lawn_mower')
export class LawnMowerController {
  constructor(
    private readonly lawnMowerService: LawnMowerService,
    private readonly inputValidationService: InputValidationService,
    private logger: Logger,
  ) {}

  //For example the input : "5 5" "1 2 N" "LFLFLFLFF" "3 3 E" "FFRFFRFRRF"
  //is a valid input
  @Post()
  async calculateLawnMowersMovements(@Req() req): Promise<string> {
    this.logger.log('Controller: Calculate lawn mowers request received');

    if (req.readable) {
      const text = await this.processInput(req);
      const dataArray: string[] = text.split('\n');
      this.inputValidationService.validate(dataArray);
      this.logger.log('The input was parsed to: ' + JSON.stringify(dataArray));

      return await this.lawnMowerService.calculateLawnMowersMovements(
        dataArray,
      );
    }
  }

  async processInput(req): Promise<string> {
    const raw = await rawbody(req);
    return raw.toString().trim();
  }
}
