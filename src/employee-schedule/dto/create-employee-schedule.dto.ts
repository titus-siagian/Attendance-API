import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateEmployeeScheduleDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNumber()
  day: number;

  @ApiProperty()
  @IsNumber()
  startTime: number;

  @ApiProperty()
  @IsNumber()
  endTime: number;
}
