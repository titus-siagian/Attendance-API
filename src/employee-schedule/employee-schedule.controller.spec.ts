import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeScheduleController } from './employee-schedule.controller';
import { EmployeeScheduleService } from './employee-schedule.service';

describe('EmployeeScheduleController', () => {
  let controller: EmployeeScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeScheduleController],
      providers: [EmployeeScheduleService],
    }).compile();

    controller = module.get<EmployeeScheduleController>(EmployeeScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
