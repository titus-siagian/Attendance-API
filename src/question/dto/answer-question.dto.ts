import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AnswerQuestionDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  answer: string;
}
