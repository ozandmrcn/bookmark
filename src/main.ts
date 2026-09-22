import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // global validation pipe - validation pipe is applied to every route handler
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip out any properties that are not in the DTO
      transform: true, // automatically transform the types of the properties of the DTO
      forbidNonWhitelisted: true, // throw an error if there are any properties that are not in the DTO
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
