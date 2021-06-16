import 'reflect-metadata';
import { AUTHORIZE_STRATEGY_METADATA } from 'app.constants';

export const AuthorizeGrantStrategy = (name: string): ClassDecorator => {
  return (target: any) => {
    Reflect.defineMetadata(AUTHORIZE_STRATEGY_METADATA, name, target);
  };
};
