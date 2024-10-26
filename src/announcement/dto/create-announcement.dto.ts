import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

export class CreateAnnouncementDto {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  expiredAt: Date;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsArray()
  companyIds: string[];

  @ApiProperty()
  @IsArray()
  divisionIds: string[];

  @ApiProperty()
  @IsArray()
  subdivisionIds: string[];
}
