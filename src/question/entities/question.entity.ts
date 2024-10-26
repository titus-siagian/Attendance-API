import { ApiProperty } from '@nestjs/swagger';

export class MultipleChoice {
  @ApiProperty()
  code: string;

  @ApiProperty()
  text: string;
}

export class QuestionEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  question: string;

  @ApiProperty({ type: MultipleChoice })
  choices: MultipleChoice[];
}
