import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ClaimForgotPasswordDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @MinLength(8)
  @IsString()
  newPassword: string;
}
