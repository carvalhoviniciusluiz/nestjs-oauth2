import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from 'app.constants';
import { Oauth2Controller } from './controllers';
import { AccessTokenEntity, ClientEntity } from './entities';
import { AccessTokenService, ClientService } from './services';

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
  controllers: [Oauth2Controller],
  exports: [TypeOrmModule]
})
export class OAuth2Module {}
