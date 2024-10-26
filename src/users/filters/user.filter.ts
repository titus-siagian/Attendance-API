import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { DefaultFilterQuery } from 'src/prisma/filter/default.filter';

export class UserQuery extends DefaultFilterQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => String)
  @IsString()
  email?: string;
}
