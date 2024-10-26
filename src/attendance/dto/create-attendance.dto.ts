import { ApiProperty } from '@nestjs/swagger';
import {
  AttendanceProblem,
  AttendanceValue,
  Prisma,
  TypeAttendance,
} from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAttendanceDto
  implements Prisma.AttendanceCreateWithoutUserInput
{
  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  longitude: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  photoUrl = '';

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  masterLocationId: string;

  @ApiProperty()
  @IsEnum(TypeAttendance)
  type: TypeAttendance;

  @ApiProperty()
  @IsEnum(AttendanceValue)
  value: AttendanceValue;

  @ApiProperty()
  @IsOptional()
  @IsEnum(AttendanceProblem)
  problem: AttendanceProblem;
}
