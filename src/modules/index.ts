import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';

// import { AdminModule } from './admin/admin.module';
// import { AppModule as ApplicationModule } from './app/app.module';
import { OAuth2Module } from './oauth2/oauth2.module';
// import { ApplicationModule as OAuth2Module } from './oauth2/application/application.module';

@Module({
  imports: [
    RouterModule.forRoutes([
      // { path: '/admin', module: AdminModule },
      // { path: '/', module: ApplicationModule },
      { path: '/v1', module: OAuth2Module }
    ]),
    // AdminModule,
    // ApplicationModule,
    OAuth2Module
  ]
})
export class AppModule {}
