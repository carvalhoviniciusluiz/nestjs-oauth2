import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';

// import { AdminModule } from './admin/admin.module';
// import { AppModule as ApplicationModule } from './app/app.module';
import { TokensModule } from './tokens/tokens.module';
import { AuthorizeModule } from './authorize/authorize.module';

@Module({
  imports: [
    RouterModule.forRoutes([
      // { path: '/admin', module: AdminModule },
      // { path: '/', module: ApplicationModule },
      { path: '/v1/authorize', module: AuthorizeModule },
      { path: '/v1/tokens', module: TokensModule }
    ]),
    // AdminModule,
    // ApplicationModule,
    TokensModule,
    AuthorizeModule
  ]
})
export class AppModule {}
