import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { isArray } from 'lodash';

export class DefaultFilterQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => (isArray(value) ? value : [value]))
  sortBy?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  skip?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  cursor?: string;
}
