import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppLogger } from './app.logger';
import { CorsOptions } from 'cors';
import { AppModule } from './app.module';

async function bootstrap() {
  const IS_DEV = process.env.NODE_ENV === 'development';
  const port = process.env.PORT || 3333;

  const app = await NestFactory.create(AppModule, {
    logger: new AppLogger(),
  });

  const corsOptions: CorsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  };
  app.enableCors(corsOptions);
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: IS_DEV,
      forbidUnknownValues: true,
      transform: true,
    }),
  );

  await app
    .listen(parseInt(port.toString(), 10), '0.0.0.0', () => {
      Logger.verbose(`Listen on ${port} 🙌 `, 'Started');
    })
    .catch((error) => Logger.error(error));
}
bootstrap();
