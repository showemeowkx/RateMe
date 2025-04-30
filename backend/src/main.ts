import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const port: string = process.env.PORT ?? '3001';
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
