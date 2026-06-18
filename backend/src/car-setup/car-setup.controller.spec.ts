import { Test, TestingModule } from '@nestjs/testing';
import { CarSetupController } from './car-setup.controller';

describe('CarSetupController', () => {
  let controller: CarSetupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarSetupController],
    }).compile();

    controller = module.get<CarSetupController>(CarSetupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
