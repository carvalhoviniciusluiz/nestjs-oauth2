import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { useContainer } from 'typeorm';
import { AppLogger } from 'app.logger';
import { enableCors } from 'cors.service';
import { enableSwagger } from 'swagger.service';
import { AppModule } from 'modules';
import { IS_PROD, APP_PORT, APP_HOST } from 'app.constants';

class Main {
  static async bootstrap() {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(), {
      logger: new AppLogger()
    });

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        disableErrorMessages: IS_PROD,
        forbidUnknownValues: true,
        whitelist: true
      })
    );

    enableCors(app);

    enableSwagger(app);

    //is used for allow custom pipes attribute
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.use(helmet());
    app.use(rateLimit({ windowMs: 60 * 1000, max: 1000 }));

    await app
      .listen(APP_PORT, APP_HOST, () => {
        Logger.verbose(`Listen on ${APP_PORT} 🙌 `, Main.name);
      })
      .catch(error => Logger.error(error));
  }
}

Main.bootstrap();
