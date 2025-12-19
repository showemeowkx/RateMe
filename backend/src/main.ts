import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const logger = new Logger();
  const portValue =
    process.env.NODE_ENV === 'production'
      ? process.env.BACK_PORT_PROD
      : process.env.BACK_PORT_DEV;
  const port: string = portValue ?? '3001';
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [/http:\/\/localhost:3000/, /https:\/\/.*\.vercel\.app/],
    credentials: true,
  });

  app.use('/payments/webhooks', bodyParser.raw({ type: 'application/json' }));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
