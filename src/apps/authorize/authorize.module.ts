import { Module, OnModuleInit, Type } from '@nestjs/common';
import { StrategyExplorer } from 'apps/@core';
import { AuthorizationsController } from './application/controllers';
import { AuthorizeService } from './infrastructure/services';
import { CodeStrategy } from './infrastructure/strategies';
import { StrategyRegistry } from './infrastructure/strategy.registry';
import { AUTHORIZE_STRATEGY_METADATA } from 'app.constants';

const controllers: Type<any>[] = [AuthorizationsController];

const Oauth2Core = [StrategyExplorer, StrategyRegistry];

const AuthorizeStrategies = [CodeStrategy];

const AuthorizeServices = [{ provide: 'AuthorizeServiceInterface', useClass: AuthorizeService }];

@Module({
  controllers: [...controllers],
  providers: [...AuthorizeStrategies, ...AuthorizeServices, ...Oauth2Core]
})
export class AuthorizeModule implements OnModuleInit {
  constructor(
    private readonly explorerService: StrategyExplorer,
    private readonly strategyRegistry: StrategyRegistry
  ) {}

  onModuleInit() {
    const { strategies } = this.explorerService.explore(AUTHORIZE_STRATEGY_METADATA);
    this.strategyRegistry.register(strategies);
  }
}
