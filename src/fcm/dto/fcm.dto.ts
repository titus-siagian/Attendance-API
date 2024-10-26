import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class FcmDto {
  @ApiProperty()
  @IsString()
  token: string;
}
