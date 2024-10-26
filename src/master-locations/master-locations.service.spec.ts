import { Test, TestingModule } from '@nestjs/testing';
import { MasterLocationsService } from './master-locations.service';

describe('MasterLocationsService', () => {
  let service: MasterLocationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MasterLocationsService],
    }).compile();

    service = module.get<MasterLocationsService>(MasterLocationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
