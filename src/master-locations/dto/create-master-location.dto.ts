import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsNumber, IsString } from 'class-validator';

export class CreateMasterLocationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsLatitude()
  @Type(() => Number)
  latitude: number;

  @ApiProperty()
  @IsLongitude()
  @Type(() => Number)
  longitude: number;

  @ApiProperty()
  @IsNumber()
  radius: number;
}
