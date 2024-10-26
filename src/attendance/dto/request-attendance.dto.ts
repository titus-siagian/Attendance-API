import { ApiProperty } from '@nestjs/swagger';
import {
  AttendanceProblem,
  AttendanceValue,
  TypeAttendance,
} from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber } from 'class-validator';

export default class RequestAttendanceDto {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  time: Date;

  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  longitude: number;

  userId: string;

  @ApiProperty({ enum: ['Visit', 'Live'] })
  @IsEnum(TypeAttendance)
  type: TypeAttendance;

  @ApiProperty({ enum: ['A1', 'A2', 'A3', 'A4', 'A5'] })
  @IsEnum(AttendanceProblem)
  problem: AttendanceProblem;

  @ApiProperty({ enum: ['ClockIn', 'ClockOut'] })
  @IsEnum(AttendanceValue)
  value: AttendanceValue;
}
