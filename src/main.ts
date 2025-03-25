import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); // Get ConfigService
  app.useGlobalPipes(new ValidationPipe());
  app.use(graphqlUploadExpress({maxFileSize:1000000, maxFiles: 5}))
  app.enableCors({
    origin: configService.get<string>('FRONT_URL'),
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
