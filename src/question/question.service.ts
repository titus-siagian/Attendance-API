import { BadRequestException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as faker from 'faker/locale/id_ID';
import { isEmpty, sortBy } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnswerQuestionDto } from './dto/answer-question.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { MultipleChoice, QuestionEntity } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService) {}

  async validate(data: AnswerQuestionDto, userId: string) {
    const findQuestion = await this.prisma.question.findFirst({
      where: {
        id: data.id,
      },
    });

    if (!findQuestion) {
      throw new BadRequestException();
    }

    if (findQuestion && findQuestion.answer !== data.answer) {
      if (findQuestion.wrongCounter + 1 > 2) {
        await this.prisma.user.update({
          data: {
            active: false,
          },
          where: { id: userId },
        });
      } else {
        await this.prisma.question.update({
          data: {
            wrongCounter: findQuestion.wrongCounter + 1,
          },
          where: {
            id: findQuestion.id,
          },
        });
      }
      throw new BadRequestException('Jawaban anda salah!');
    }

    return {};
  }

  async create(userId: string) {
    const findRelation = await this.prisma.family.findMany({
      where: {
        userId: userId,
      },
    });

    if (isEmpty(findRelation)) {
      throw new BadRequestException(
        'Mohon untuk menambahkan informasi keluarga',
      );
    }

    const totalFamily = findRelation.length;
    const indexFamily = Math.floor(Math.random() * totalFamily);

    const relationship = [
      { state: 'Ayah', value: 1 },
      { state: 'Ibu', value: 2 },
      { state: 'Istri', value: 3 },
      { state: 'Suami', value: 4 },
      { state: 'Saudara ke 1', value: 5 },
      { state: 'Saudara ke 2', value: 6 },
      { state: 'Saudara ke 3', value: 7 },
      { state: 'Saudara ke 4', value: 8 },
      { state: 'Saudara ke 5', value: 9 },
      { state: 'Saudara ke 6', value: 10 },
      { state: 'Anak ke 1', value: 11 },
      { state: 'Anak ke 2', value: 12 },
      { state: 'Anak ke 3', value: 13 },
      { state: 'Anak ke 4', value: 14 },
      { state: 'Anak ke 5', value: 15 },
      { state: 'Anak ke 6', value: 16 },
    ];

    // generate question
    const questionDictionary = [
      {
        state: `Siapakah nama ${
          relationship[findRelation[indexFamily].relationship - 1].state
        } anda?`,
        value: 0,
      },
      {
        state: `Berapa tanggal lahir ${
          relationship[findRelation[indexFamily].relationship - 1].state
        } anda?`,
        value: 1,
      },
      {
        state: `Tempat lahir ${
          relationship[findRelation[indexFamily].relationship - 1].state
        } anda?`,
        value: 2,
      },
    ];
    const indexQuestion = Math.floor(Math.random() * questionDictionary.length);
    const question = questionDictionary[indexQuestion];

    // get answer
    const code = ['A', 'B', 'C', 'D'];
    const randIndex = Math.floor(Math.random() * code.length);
    const getAnswer = code[randIndex];
    code.splice(randIndex, 1);

    const createQuestion: CreateQuestionDto = {
      question: question.state,
      answer: getAnswer,
    };

    const createdQuestion = await this.prisma.question.create({
      data: createQuestion,
      select: {
        id: true,
        question: true,
        answer: false,
      },
    });

    let generateText: string;

    if (indexQuestion === 0) {
      generateText = findRelation[indexFamily].name;
    } else if (indexQuestion === 1) {
      generateText = dayjs(findRelation[indexFamily].dateOfBirth).format(
        'DD MMMM YYYY',
      );
    } else {
      generateText = findRelation[indexFamily].placeOfBirth;
    }

    const multipleChoice: MultipleChoice[] = [
      {
        code: getAnswer,
        text: generateText,
      },
    ];

    const findMultipleChoice = Array.from({ length: 3 }, () => {
      if (indexQuestion === 0) {
        return faker.name.findName();
      }
      if (indexQuestion === 1) {
        const getYear = findRelation[indexFamily].dateOfBirth.getFullYear();
        return dayjs(
          faker.date.between(`${getYear}-1-1`, `${getYear}-12-31`),
        ).format('DD MMMM YYYY');
      }
      return faker.address.cityName();
    });

    findMultipleChoice.forEach((val) => {
      const randIndex = Math.floor(Math.random() * code.length);
      const getAnswer = code[randIndex];
      code.splice(randIndex, 1);
      multipleChoice.push({
        code: getAnswer,
        text: val,
      });
    });

    const response: QuestionEntity = {
      ...createdQuestion,
      choices: sortBy(multipleChoice, 'code'),
    };

    return {
      data: response,
    };
  }
}
