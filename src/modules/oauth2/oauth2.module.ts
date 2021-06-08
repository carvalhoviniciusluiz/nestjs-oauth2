import { Module, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from 'app.constants';
import { Oauth2Controller } from './application/controllers';
import { AccessTokenEntity, ClientEntity, AccessTokenService, ClientService } from './domain';

const controllers: Type<any>[] = [Oauth2Controller];

@Module({
  imports: [
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
      logging: true,
      cli: {
        migrationsDir: `${__dirname}/../migrations`
      }
    }),
    TypeOrmModule.forFeature([ClientEntity, AccessTokenEntity])
  ],
  providers: [
    { provide: 'ClientServiceInterface', useClass: ClientService },
    { provide: 'AccessTokenServiceInterface', useClass: AccessTokenService }
  ],
  controllers: [...controllers],
  exports: [TypeOrmModule]
})
export class OAuth2Module {}
