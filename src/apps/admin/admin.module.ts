import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_DB, MONGO_HOST, MONGO_PORT } from 'app.constants';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';

const uri = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

@Module({
  imports: [MongooseModule.forRoot(uri)],
  controllers: [AppController],
  providers: [AppService]
})
export class AdminModule {}
