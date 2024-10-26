import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiCustomResponse } from 'src/prisma/response/default.response';
import { AnswerQuestionDto } from './dto/answer-question.dto';
import { QuestionEntity } from './entities/question.entity';
import { QuestionService } from './question.service';

@ApiTags('Questions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('question')
@ApiExtraModels(QuestionEntity)
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiCustomResponse(QuestionEntity)
  @Post()
  create(@Req() request: Request) {
    const token = request.headers.authorization.split(' ')[1];
    const user = this.jwtService.verify(token);
    return this.questionService.create(user.id);
  }

  @Post('validate')
  validate(
    @Body() answerQuestionDto: AnswerQuestionDto,
    @Req() request: Request,
  ) {
    const token = request.headers.authorization.split(' ')[1];
    const user = this.jwtService.verify(token);
    return this.questionService.validate(answerQuestionDto, user.id);
  }
}
