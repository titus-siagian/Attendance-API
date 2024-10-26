import { ApiProperty } from '@nestjs/swagger';
import { Subdivision } from '@prisma/client';

export class SubdivisionEntity implements Subdivision {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  divisionId: string;
}
