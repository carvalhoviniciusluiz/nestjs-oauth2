import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CorsOptions } from 'cors';
import { AppLogger } from 'app.logger';
import { AppModule } from 'app.module';
import { enableSwagger } from 'swagger.service';

class Main {
  static async bootstrap() {
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

    enableSwagger(app);

    await app
      .listen(parseInt(port.toString(), 10), '0.0.0.0', () => {
        Logger.verbose(`Listen on ${port} 🙌 `, Main.name);
      })
      .catch((error) => Logger.error(error));
  }
}

Main.bootstrap();
