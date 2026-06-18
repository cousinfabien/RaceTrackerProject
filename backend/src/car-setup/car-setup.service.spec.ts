import { Test, TestingModule } from '@nestjs/testing';
import { CarSetupService } from './car-setup.service';

describe('CarSetupService', () => {
  let service: CarSetupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarSetupService],
    }).compile();

    service = module.get<CarSetupService>(CarSetupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
