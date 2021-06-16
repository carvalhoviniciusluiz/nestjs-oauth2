import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthorizeService {
  getHello(): string {
    return 'Hello Authorized!';
  }
}
