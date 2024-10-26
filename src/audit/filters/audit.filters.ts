import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { DefaultFilterQuery } from 'src/prisma/filter/default.filter';

export default class AuditQuery extends DefaultFilterQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  userId?: string;
}
