import 'reflect-metadata';
import { OAUTH2_STRATEGY_METADATA } from '../strategy.constants';

export const Oauth2GrantStrategy = (name: string): ClassDecorator => {
  return (target: any) => {
    Reflect.defineMetadata(OAUTH2_STRATEGY_METADATA, name, target);
  };
};
