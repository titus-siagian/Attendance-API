import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { first } from 'lodash';
import { env } from 'process';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('HR System Swagger')
    .setDescription('The HR System API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (error) => {
        const getError = first(error);
        const parsingError = Object.keys(getError.constraints).map(
          (key) => getError.constraints[key],
        );
        return new BadRequestException(first(parsingError));
      },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalFilters(new PrismaClientExceptionFilter());

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(env.SERVER_PORT);
}
bootstrap();
