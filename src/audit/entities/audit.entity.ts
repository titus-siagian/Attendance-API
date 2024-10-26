import { ApiProperty } from '@nestjs/swagger';
import { History } from '@prisma/client';

export default class AuditEntity implements History {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  oldValue: string;

  @ApiProperty()
  newValue: string;
}
