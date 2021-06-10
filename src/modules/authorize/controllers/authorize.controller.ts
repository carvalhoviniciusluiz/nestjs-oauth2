import { Controller, Get } from '@nestjs/common';
import { AuthorizeService } from '../services/authorize.service';

@Controller()
export class AuthorizeController {
  constructor(private readonly authorizeService: AuthorizeService) {}

  @Get()
  getHello(): string {
    return this.authorizeService.getHello();
  }
}
