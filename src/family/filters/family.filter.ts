import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { DefaultFilterQuery } from 'src/prisma/filter/default.filter';

export class FamilyQuery extends DefaultFilterQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => String)
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => String)
  username?: string;
}
