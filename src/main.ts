import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

/**
 * Bootstraps the NestJS application.
 * - Creates the app from the root AppModule.
 * - Installs a global ValidationPipe used by every route handler.
 * - Listens on the PORT environment variable (defaults to 3000).
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe - applied to every route handler.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip out any properties that are not declared in the DTO
      transform: true, // transform incoming values into the DTO's declared types
      forbidNonWhitelisted: true, // reject requests containing unexpected properties
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
