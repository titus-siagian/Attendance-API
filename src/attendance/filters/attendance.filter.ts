import { ApiProperty } from '@nestjs/swagger';
import { AttendanceValue, TypeAttendance } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { DefaultFilterQuery } from 'src/prisma/filter/default.filter';

export default class AttendanceQuery extends DefaultFilterQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(TypeAttendance)
  @Transform((status) => TypeAttendance[status.value])
  type?: TypeAttendance;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(AttendanceValue)
  @Transform((status) => AttendanceValue[status.value])
  value?: AttendanceValue;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  userId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  username?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  identityNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  endDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return [true, 'enabled', 'true', 1, '1'].indexOf(value) > -1;
  })
  image?: boolean;
}
