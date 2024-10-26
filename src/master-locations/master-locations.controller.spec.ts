import { Test, TestingModule } from '@nestjs/testing';
import { MasterLocationsController } from './master-locations.controller';
import { MasterLocationsService } from './master-locations.service';

describe('MasterLocationsController', () => {
  let controller: MasterLocationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MasterLocationsController],
      providers: [MasterLocationsService],
    }).compile();

    controller = module.get<MasterLocationsController>(MasterLocationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
