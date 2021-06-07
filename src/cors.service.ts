import { INestApplication } from '@nestjs/common';
import { CorsOptions } from 'cors';

export const enableCors = (app: INestApplication) => {
  const corsOptions: CorsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    preflightContinue: false,
    optionsSuccessStatus: 200
  };
  app.enableCors(corsOptions);
};
