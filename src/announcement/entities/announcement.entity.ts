import { Announcement } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AnnouncementEntity implements Announcement {
  @ApiProperty()
  subdivisionIds: string;

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  id: number;

  @ApiProperty()
  companyIds: string;

  @ApiProperty()
  divisionIds: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  expiredAt: Date;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty()
  schedule: Date;
}
