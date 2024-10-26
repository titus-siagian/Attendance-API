import { Family } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class FamilyEntity implements Family {
  @ApiProperty()
  id: string;

  @ApiProperty()
  identityNumber: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  sex: number;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty()
  placeOfBirth: string;

  @ApiProperty()
  relationship: number;

  @ApiProperty()
  userId: string;
}
