import * as dotenv from 'dotenv';

const result = dotenv.config();

const ENV_FILE = result.parsed || {};

export const VERSION = (process.env.VERSION || ENV_FILE.VERSION || 'dev').trim();

export const NODE_ENV = (process.env.NODE_ENV || 'production').trim();
export const PORT = (process.env.PORT || '3333').trim();
export const HOST = (process.env.HOST || '0.0.0.0').trim();

export const IS_DEV = NODE_ENV !== 'production' && NODE_ENV !== 'test';

export const POSTGRES_DB = process.env.POSTGRES_DB;
export const POSTGRES_HOST = process.env.POSTGRES_HOST;
export const POSTGRES_PORT = process.env.POSTGRES_PORT;
export const POSTGRES_USER = process.env.POSTGRES_USER;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;

export const MONGO_DB = process.env.MONGO_DB;
export const MONGO_HOST = process.env.MONGO_HOST;
export const MONGO_PORT = process.env.MONGO_PORT;
export const MONGO_USER = process.env.MONGO_USER;
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

if (NODE_ENV !== 'test') {
  console.table(ENV_FILE);
}
