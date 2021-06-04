import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from 'app.vars';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: POSTGRES_HOST,
      port: parseInt(POSTGRES_PORT, 10),
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
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
