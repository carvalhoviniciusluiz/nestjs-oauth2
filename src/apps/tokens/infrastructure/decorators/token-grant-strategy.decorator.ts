import 'reflect-metadata';
import { TOKEN_STRATEGY_METADATA } from 'app.constants';

export const TokenGrantStrategy = (name: string): ClassDecorator => {
  return (target: any) => {
    Reflect.defineMetadata(TOKEN_STRATEGY_METADATA, name, target);
  };
};
