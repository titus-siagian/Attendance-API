import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDivisonDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  companyId: string;
}
