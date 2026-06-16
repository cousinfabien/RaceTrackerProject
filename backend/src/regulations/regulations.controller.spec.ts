import { Test, TestingModule } from '@nestjs/testing';
import { RegulationsController } from './regulations.controller';

describe('RegulationsController', () => {
  let controller: RegulationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegulationsController],
    }).compile();

    controller = module.get<RegulationsController>(RegulationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
