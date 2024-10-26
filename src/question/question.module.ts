import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'process';

@Module({
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET,
    }),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
