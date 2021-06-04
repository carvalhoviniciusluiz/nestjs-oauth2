import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CorsOptions } from 'cors';
import { AppLogger } from 'app.logger';
import { enableSwagger } from 'swagger.service';
import { ApplicationModule } from 'modules';
import { IS_DEV, PORT, HOST } from 'app.vars';

class Main {
  static async bootstrap() {
    const app = await NestFactory.create(ApplicationModule, {
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
      .listen(parseInt(PORT.toString(), 10), HOST, () => {
        Logger.verbose(`Listen on ${PORT} 🙌 `, Main.name);
      })
      .catch((error) => Logger.error(error));
  }
}

Main.bootstrap();
