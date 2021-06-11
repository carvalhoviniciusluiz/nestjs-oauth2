import { Module, OnModuleInit, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Oauth2Controller } from './application/controllers';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientCredentialsStrategy, RefreshTokenStrategy, PasswordStrategy } from './infrastructure/strategies';
import { CreateAccessTokenHandler } from './infrastructure/commands';
import { AccessTokenCreatedEventHandler } from './infrastructure/events';
import { ClientEntity, AccessTokenEntity } from './infrastructure/entities';
import { AccessTokenService, ClientService } from './infrastructure/services';
import { Oauth2GrantStrategyRegistry, StrategyExplorer } from './infrastructure/core';
import { POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from 'app.constants';
import { UserValidator } from './infrastructure/validators';

const controllers: Type<any>[] = [Oauth2Controller];

const Oauth2Core = [StrategyExplorer, Oauth2GrantStrategyRegistry];

const Oauth2Strategies = [ClientCredentialsStrategy, RefreshTokenStrategy, PasswordStrategy];

const Oauth2Services = [
  { provide: 'ClientServiceInterface', useClass: ClientService },
  { provide: 'AccessTokenServiceInterface', useClass: AccessTokenService }
];

const Oauth2CommandHandlers = [CreateAccessTokenHandler];

const Oauth2EventHandlers = [AccessTokenCreatedEventHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: POSTGRES_HOST,
      port: POSTGRES_PORT,
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      entities: [`${__dirname}/../**/*.entity.{js,ts}`],
      migrations: [`${__dirname}/../migrations/*.{js,ts}`],
      synchronize: true,
      logging: false,
      cli: {
        migrationsDir: `${__dirname}/../migrations`
      }
    }),
    TypeOrmModule.forFeature([ClientEntity, AccessTokenEntity])
  ],
  providers: [
    { provide: 'UserValidatorInterface', useClass: UserValidator },
    ...Oauth2Services,
    ...Oauth2Core,
    ...Oauth2Strategies,
    ...Oauth2CommandHandlers,
    ...Oauth2EventHandlers
  ],
  controllers: [...controllers],
  exports: [TypeOrmModule]
})
export class TokensModule implements OnModuleInit {
  constructor(
    private readonly explorerService: StrategyExplorer,
    private readonly strategyRegistry: Oauth2GrantStrategyRegistry
  ) {}

  onModuleInit() {
    const { strategies } = this.explorerService.explore();
    this.strategyRegistry.register(strategies);
  }
}
