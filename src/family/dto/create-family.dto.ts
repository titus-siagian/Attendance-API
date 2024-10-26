import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateFamilyDto {
  @ApiProperty()
  @IsString()
  identityNumber: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  sex: number;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @ApiProperty()
  @IsString()
  placeOfBirth: string;

  @ApiProperty()
  @IsNumber()
  relationship: number;

  @ApiProperty()
  @IsString()
  userId: string;
}
