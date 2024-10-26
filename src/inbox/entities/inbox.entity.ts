import { ApiProperty } from '@nestjs/swagger';
import { Inbox, Prisma } from '@prisma/client';

export default class InboxEntity implements Inbox {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  data: string;

  @ApiProperty()
  userIds: Prisma.JsonValue;
}
