import { ApiProperty } from '@nestjs/swagger';
import { ForgotPassword } from '@prisma/client';

export class ForgotPasswordEntity implements ForgotPassword {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  claimed: boolean;
}
