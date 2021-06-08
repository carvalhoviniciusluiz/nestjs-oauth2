import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

const result = dotenv.config();

const ENV_FILE = result.parsed || {};

const configService = new ConfigService();

export const VERSION = configService.get<string>('VERSION') || '1';
export const MAJOR = configService.get<string>('MAJOR') || 'dev';

export const NODE_ENV = configService.get<string>('NODE_ENV') || 'production';
export const APP_PORT = configService.get<number>('APP_PORT') || 3333;
export const APP_HOST = configService.get<string>('APP_HOST') || '0.0.0.0';

export const IS_PROD = NODE_ENV === 'production';

export const POSTGRES_DB = configService.get<string>('POSTGRES_DB');
export const POSTGRES_HOST = configService.get<string>('POSTGRES_HOST');
export const POSTGRES_PORT = configService.get<number>('POSTGRES_PORT');
export const POSTGRES_USER = configService.get<string>('POSTGRES_USER');
export const POSTGRES_PASSWORD = configService.get<string>('POSTGRES_PASSWORD');

export const MONGO_DB = configService.get<string>('MONGO_DB');
export const MONGO_HOST = configService.get<string>('MONGO_HOST');
export const MONGO_PORT = configService.get<number>('MONGO_PORT');
export const MONGO_USER = configService.get<string>('MONGO_USER');
export const MONGO_PASSWORD = configService.get<string>('MONGO_PASSWORD');

if (NODE_ENV !== 'test') {
  console.table(ENV_FILE);
}
