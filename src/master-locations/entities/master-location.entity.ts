import { MasterLocation } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class MasterLocationEntity implements MasterLocation {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty({ type: Number })
  latitude: number;

  @ApiProperty({ type: Number })
  longitude: number;

  @ApiProperty()
  radius: number;
}
