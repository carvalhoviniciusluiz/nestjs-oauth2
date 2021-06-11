import { Module } from '@nestjs/common';
import { AuthorizeController } from './controllers/authorize.controller';
import { AuthorizeService } from './services/authorize.service';

@Module({
  controllers: [AuthorizeController],
  providers: [AuthorizeService]
})
export class AuthorizeModule {}
