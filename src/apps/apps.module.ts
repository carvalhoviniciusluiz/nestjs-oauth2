import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from 'nest-router';

// import { AdminModule } from './admin/admin.module';
import { TokensModule } from './tokens/tokens.module';
import { AuthorizeModule } from './authorize/authorize.module';

import { POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from 'app.constants';

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
      logging: false,
      cli: {
        migrationsDir: `${__dirname}/../migrations`
      }
    }),
    RouterModule.forRoutes([
      // { path: '/admin', module: AdminModule },
      { path: '/v1/authorize', module: AuthorizeModule },
      { path: '/v1/tokens', module: TokensModule }
    ]),
    // AdminModule,
    TokensModule,
    AuthorizeModule
  ],
  exports: [TypeOrmModule]
})
export class AppsModule {}
