import { Test, TestingModule } from '@nestjs/testing';
import { LawnMowerService } from './services/lawn-mower.service';
import { Logger } from '@nestjs/common';
import { LawnMowerController } from './lawn-mower.controller';
import { ConversionService } from './services/conversion.service';
import { mockRequest } from 'jest-mock-req-res';
import { InputValidationService } from './services/input-validation.service';

class LawnMowerControllerTest extends LawnMowerController {
  async processInput(req): Promise<string> {
    return req.testInput;
  }
}

describe('ReadingListController', () => {
  let service: LawnMowerControllerTest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LawnMowerControllerTest,
        LawnMowerController,
        LawnMowerService,
        ConversionService,
        InputValidationService,
        Logger,
      ],
    }).compile();
    service = module.get<LawnMowerControllerTest>(LawnMowerControllerTest);
  });
  it('test 3 mowers', async () => {
    const req = mockRequest({
      readable: true,
      testInput: '5 5\n1 2 N\nLFLFLFLFF\n3 3 W\nFFRFFRFRRF\n3 3 S\nFFRFFRFRRF',
    });

    const actual = await service.calculateLawnMowersMovements(req);

    expect(actual).toEqual('1 3 N\n1 5 W\n1 1 S');
  });

  it('test 2 mowers', async () => {
    const req = mockRequest({
      readable: true,
      testInput: '5 5\n1 2 N\nLFLFLFLFF\n3 3 E\nFFRFFRFRRF',
    });

    const actual = await service.calculateLawnMowersMovements(req);

    expect(actual).toEqual('1 3 N\n5 1 E');
  });

  it('test one mower', async () => {
    const req = mockRequest({
      readable: true,
      testInput: '5 5\n1 2 N\nLFLFLFLFF',
    });

    const actual = await service.calculateLawnMowersMovements(req);

    expect(actual).toEqual('1 3 N');
  });

  it('test empty input', async () => {
    const req = mockRequest({
      readable: true,
      testInput: '',
    });

    try {
      await service.calculateLawnMowersMovements(req);
      expect(true).toBeFalsy(); //Should not reach this line;
    } catch (actual) {
      expect(actual.status).toEqual(400);
      expect(actual.message).toEqual('Insufficient input');
    }
  });

  it('test no mowers', async () => {
    const req = mockRequest({
      readable: true,
      testInput: '5 5',
    });

    try {
      await service.calculateLawnMowersMovements(req);
      expect(true).toBeFalsy(); //Should not reach this line;
    } catch (actual) {
      expect(actual.status).toEqual(400);
      expect(actual.message).toEqual('Insufficient input');
    }
  });

  it('test bad orientation', async () => {
    const req = mockRequest({
      readable: true,
      testInput: '5 5\n1 2 L\nLFLFLFLFF',
    });

    try {
      await service.calculateLawnMowersMovements(req);
      expect(true).toBeFalsy(); //Should not reach this line;
    } catch (actual) {
      expect(actual.status).toEqual(400);
      expect(actual.message).toEqual('Bad orientation');
    }
  });

  it('test bad dimensions', async () => {
    const req = mockRequest({
      readable: true,
      testInput: '5 5 6\n1 2 N\nLFLFLFLFF',
    });

    try {
      await service.calculateLawnMowersMovements(req);
      expect(true).toBeFalsy(); //Should not reach this line;
    } catch (actual) {
      expect(actual.status).toEqual(400);
      expect(actual.message).toEqual('Bad dimensions');
    }
  });

  it('test Insufficient position arguments', async () => {
    const req = mockRequest({
      readable: true,
      testInput: '5 5\n1 N\nLFLFLFLFF',
    });

    try {
      await service.calculateLawnMowersMovements(req);
      expect(true).toBeFalsy(); //Should not reach this line;
    } catch (actual) {
      expect(actual.status).toEqual(400);
      expect(actual.message).toEqual('Insufficient position arguments');
    }
  });

  it('test Bad position', async () => {
    const req = mockRequest({
      readable: true,
      testInput: '5 5\n1 G N\nLFLFLFLFF',
    });

    try {
      await service.calculateLawnMowersMovements(req);
      expect(true).toBeFalsy(); //Should not reach this line;
    } catch (actual) {
      expect(actual.status).toEqual(400);
      expect(actual.message).toEqual('Bad position');
    }
  });
});
