import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';

// import { AdminModule } from './admin/admin.module';
import { TokensModule } from './tokens/tokens.module';
import { AuthorizeModule } from './authorize/authorize.module';

@Module({
  imports: [
    RouterModule.forRoutes([
      // { path: '/admin', module: AdminModule },
      { path: '/v1/authorize', module: AuthorizeModule },
      { path: '/v1/tokens', module: TokensModule }
    ]),
    // AdminModule,
    TokensModule,
    AuthorizeModule
  ]
})
export class AppsModule {}
