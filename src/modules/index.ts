import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';

// import { AdminModule } from './admin/admin.module';
// import { AppModule as ApplicationModule } from './app/app.module';
import { OAuth2Module } from './oauth2/oauth2.module';
import { AuthorizeModule } from './authorize/authorize.module';

@Module({
  imports: [
    RouterModule.forRoutes([
      // { path: '/admin', module: AdminModule },
      // { path: '/', module: ApplicationModule },
      { path: '/v1/authorize', module: AuthorizeModule },
      { path: '/v1/oauth2', module: OAuth2Module }
    ]),
    // AdminModule,
    // ApplicationModule,
    OAuth2Module,
    AuthorizeModule
  ]
})
export class AppModule {}
