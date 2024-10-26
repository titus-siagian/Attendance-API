import { Prisma, Role } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto implements Prisma.UserUncheckedCreateInput {
  @ApiProperty()
  @IsOptional()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  identityNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  active: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  avatarUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(8)
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  placeOfBirth: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  sex: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  blood: string;

  @ApiProperty()
  @IsString()
  subdivisionId: string;

  @ApiProperty()
  @IsString()
  departmentId: string;

  @ApiProperty()
  @IsString()
  companyId: string;

  @ApiProperty()
  @IsString()
  divisionId: string;

  @ApiProperty()
  @IsEnum(Role)
  role: Role;
}
