import { Attachment } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AttachmentEntity implements Attachment {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  announcementId: number;
}
