import { Company } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CompanyEntity implements Company {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}
