import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { LawnMower } from '../types/lawn-mower';
import { Orientation } from '../enum/orientation';
import { ConversionService } from './conversion.service';

@Injectable()
export class LawnMowerService {
  constructor(
    private conversionService: ConversionService,
    private readonly logger: Logger,
  ) {}

  async calculateLawnMowersMovements(dataArray: string[]): Promise<string> {
    this.logger.log('Service: Calculating lawn mowers movements\n');
    const dimensions: number[] = this.initBoard(dataArray[0]);
    const mowers: LawnMower[] = this.initMowers(dataArray.slice(1));
    const movedMowers: LawnMower[] = this.moveMowers(dimensions, mowers);
    return this.conversionService.buildOutput(movedMowers);
  }

  private initMowers(dataArray: string[]): LawnMower[] {
    const mowers: LawnMower[] = [];
    for (let i = 0; i < dataArray.length - 1; i = i + 2) {
      const initialPositionAndOrientation: string[] = dataArray[i].split(' ');
      if (initialPositionAndOrientation.length !== 3) {
        throw new BadRequestException('Insufficient position arguments');
      }
      const x = parseInt(initialPositionAndOrientation[0]);
      const y = parseInt(initialPositionAndOrientation[1]);
      if (!x || !y) {
        throw new BadRequestException('Bad position');
      }
      const initialPosition: { x: number; y: number } = {
        x,
        y,
      };
      const orientation: Orientation =
        Orientation[initialPositionAndOrientation[2]];
      if (orientation == null) {
        throw new BadRequestException('Bad orientation');
      }
      const instructionSequence: string = dataArray[i + 1];
      const singleLawnMower: LawnMower = new LawnMower(
        initialPosition,
        orientation,
        instructionSequence,
      );
      this.printMower(singleLawnMower);
      mowers.push(singleLawnMower);
    }
    return mowers;
  }

  private initBoard(firstArgument: string): number[] {
    const splicedValues = firstArgument.split(' ');
    const matrixStringDimensions: number[] = splicedValues.map(Number);
    if (matrixStringDimensions.length != 2) {
      throw new BadRequestException('Bad dimensions');
    }
    this.logger.log(
      'Initializing lawn dimensions: ' + matrixStringDimensions + '\n',
    );
    return matrixStringDimensions;
  }

  public printMower(singleLawnMower: LawnMower): void {
    this.logger.log('position: ' + JSON.stringify(singleLawnMower.position));
    this.logger.log(
      'orientation: ' +
        this.conversionService.orientationToString(singleLawnMower.orientation),
    );
    this.logger.log(
      'instructionSequence: ' + singleLawnMower.instructionSequence + '\n',
    );
  }

  private moveMowers(dimensions: number[], mowers: LawnMower[]): LawnMower[] {
    const movedMowers: LawnMower[] = [];
    for (const mower of mowers) {
      for (let i = 0; i < mower.instructionSequence.length; i++) {
        const curr = mower.instructionSequence.charAt(i);
        switch (curr) {
          case 'R':
            mower.orientation = this.rotateMower(mower.orientation, 'R');
            break;
          case 'L':
            mower.orientation = this.rotateMower(mower.orientation, 'L');
            break;
          case 'F':
            mower.position = this.moveMower(
              mower.position,
              mower.orientation,
              dimensions,
            );
            break;
        }
      }
      movedMowers.push(mower);
    }
    return movedMowers;
  }

  private rotateMower(
    orientation: Orientation,
    direction: string,
  ): Orientation {
    if (direction === 'R') {
      const index = (orientation.valueOf() + 1) % 4;
      return this.conversionService.getOrientationByNumber(index);
    } else if (direction === 'L') {
      const index = (((orientation.valueOf() - 1) % 4) + 4) % 4;
      return this.conversionService.getOrientationByNumber(index);
    }
  }

  // noinspection JSMethodCanBeStatic
  private moveMower(
    position: { x: number; y: number },
    orientation: Orientation,
    dimensions: number[],
  ): { x: number; y: number } {
    switch (orientation) {
      case Orientation.N:
        return {
          x: position.x,
          y: Math.min(position.y + 1, dimensions[1]),
        };
      case Orientation.E:
        return {
          x: Math.min(position.x + 1, dimensions[0]),
          y: position.y,
        };
      case Orientation.S:
        return {
          x: position.x,
          y: Math.max(position.y - 1, 0),
        };
      case Orientation.W:
        return {
          x: Math.max(position.x - 1, 0),
          y: position.y,
        };
    }
  }
}
