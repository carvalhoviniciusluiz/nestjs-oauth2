import { Module, OnModuleInit, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { StrategyExplorer } from 'apps/@core';
import { TokensController } from './application/controllers';
import { ClientCredentialsStrategy, RefreshTokenStrategy, PasswordStrategy } from './infrastructure/strategies';
import { CreateAccessTokenHandler } from './infrastructure/commands';
import { AccessTokenCreatedEventHandler } from './infrastructure/events';
import { ClientEntity, AccessTokenEntity } from './infrastructure/entities';
import { AccessTokenService, ClientService } from './infrastructure/services';
import { UserValidator } from './infrastructure/validators';
import { StrategyRegistry } from './infrastructure';
import { TOKEN_STRATEGY_METADATA } from 'app.constants';

const Oauth2Core = [StrategyExplorer, StrategyRegistry];

const TokenControllers: Type<any>[] = [TokensController];

const TokenStrategies = [ClientCredentialsStrategy, RefreshTokenStrategy, PasswordStrategy];

const TokenServices = [
  { provide: 'ClientServiceInterface', useClass: ClientService },
  { provide: 'AccessTokenServiceInterface', useClass: AccessTokenService }
];

const TokenValidators = [{ provide: 'UserValidatorInterface', useClass: UserValidator }];

const TokenCommandHandlers = [CreateAccessTokenHandler];

const TokenEventHandlers = [AccessTokenCreatedEventHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ClientEntity, AccessTokenEntity])],
  providers: [
    ...Oauth2Core,
    ...TokenServices,
    ...TokenStrategies,
    ...TokenValidators,
    ...TokenCommandHandlers,
    ...TokenEventHandlers
  ],
  controllers: [...TokenControllers],
  exports: [TypeOrmModule]
})
export class TokensModule implements OnModuleInit {
  constructor(
    private readonly explorerService: StrategyExplorer,
    private readonly strategyRegistry: StrategyRegistry
  ) {}

  onModuleInit() {
    const { strategies } = this.explorerService.explore(TOKEN_STRATEGY_METADATA);
    this.strategyRegistry.register(strategies);
  }
}
