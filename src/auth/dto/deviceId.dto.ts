import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeviceIdDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  userId: string;
}
