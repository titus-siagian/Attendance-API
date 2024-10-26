import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { DefaultFilterQuery } from 'src/prisma/filter/default.filter';

export default class InboxQuery extends DefaultFilterQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => String)
  @IsString()
  userId?: string;
}
