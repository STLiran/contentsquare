import { Injectable, Logger } from '@nestjs/common';
import { LawnMower } from '../types/lawn-mower';
import { Orientation } from '../enum/orientation';

@Injectable()
export class ConversionService {
  constructor(private readonly logger: Logger) {}

  public orientationToString(orientation: Orientation): string {
    switch (orientation) {
      case Orientation.N:
        return 'N';
      case Orientation.E:
        return 'E';
      case Orientation.S:
        return 'S';
      case Orientation.W:
        return 'W';
    }
  }

  public getOrientationByNumber(
    index: number,
  ): Orientation.S | Orientation.W | Orientation.N | Orientation.E {
    switch (index) {
      case 0:
        return Orientation.N;
      case 1:
        return Orientation.E;
      case 2:
        return Orientation.S;
      case 3:
        return Orientation.W;
    }
  }

  public buildOutput(movedMowers: LawnMower[]): string {
    let str = '';
    for (let i = 0; i < movedMowers.length; i++) {
      const mower = movedMowers[i];
      str = str.concat(
        `${mower.position.x} ${mower.position.y} ${this.orientationToString(
          mower.orientation,
        )}`,
      );
      if (i < movedMowers.length - 1) {
        str = str.concat('\n');
      }
    }
    this.logger.log('The output will be: \n' + str);
    return str;
  }
}
