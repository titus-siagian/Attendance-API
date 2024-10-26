import { Role, User } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UserEntity implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  identityNumber: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  password: string;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty()
  placeOfBirth: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  position: string;

  @ApiProperty()
  sex: number;

  @ApiProperty()
  blood: string;

  @ApiProperty()
  subdivisionId: string;

  @ApiProperty()
  departmentId: string;

  @ApiProperty()
  companyId: string;

  deviceId: string;

  @ApiProperty()
  divisionId: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;

  @ApiProperty()
  employeeScheduleId: number;
}
