import { Department } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class DepartmentEntity implements Department {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  subdivisionId: string;
}
