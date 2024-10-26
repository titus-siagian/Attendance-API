import { EmployeeSchedule } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class EmployeeScheduleEntity implements EmployeeSchedule {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  day: number;

  @ApiProperty()
  startTime: number;

  @ApiProperty()
  endTime: number;
}
