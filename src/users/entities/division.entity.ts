import { Division } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class DivisonEntity implements Division {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  companyId: string;
}
