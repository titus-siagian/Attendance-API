import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @MinLength(8)
  @IsString()
  currentPassword: string;

  @ApiProperty()
  @MinLength(8)
  @IsString()
  newPassword: string;
}
