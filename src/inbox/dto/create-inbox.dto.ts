import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export default class CreateInboxDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  body: string;

  @ApiProperty()
  @IsString()
  data: string;

  @ApiProperty()
  @IsArray()
  userIds: string[];
}
