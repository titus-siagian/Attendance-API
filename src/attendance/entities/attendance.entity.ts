import {
  Attendance,
  AttendanceProblem,
  AttendanceValue,
  TypeAttendance,
} from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class AttendanceEntity implements Attendance {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  photoUrl: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  masterLocationId: string;

  @ApiProperty({ enum: TypeAttendance })
  @IsEnum(TypeAttendance)
  type: TypeAttendance;

  @ApiProperty({ enum: AttendanceValue })
  @IsEnum(AttendanceValue)
  value: AttendanceValue;

  @ApiProperty({ enum: AttendanceProblem })
  @IsEnum(AttendanceProblem)
  problem: AttendanceProblem;

  constructor(partial: Partial<AttendanceEntity>) {
    Object.assign(this, partial);
  }
}
