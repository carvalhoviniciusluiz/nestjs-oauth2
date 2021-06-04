import * as dotenv from 'dotenv';

const result = dotenv.config();

const ENV_FILE = result.parsed || {};

export const VERSION = (
  process.env.VERSION ||
  ENV_FILE.VERSION ||
  'dev'
).trim();

export const NODE_ENV = (process.env.NODE_ENV || 'production').trim();
export const PORT = (process.env.PORT || '3333').trim();
export const HOST = (process.env.HOST || '0.0.0.0').trim();

export const IS_DEV = NODE_ENV !== 'production' && NODE_ENV !== 'test';

if (NODE_ENV !== 'test') {
  console.table(ENV_FILE);
}
