import { ApiProperty } from '@nestjs/swagger';

export class NearestLocationEntity {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: Number })
  latitude: number;

  @ApiProperty({ type: Number })
  longitude: number;

  @ApiProperty({ type: Number })
  distance: number;
}
