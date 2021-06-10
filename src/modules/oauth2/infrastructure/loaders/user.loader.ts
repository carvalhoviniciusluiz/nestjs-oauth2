import { Injectable } from '@nestjs/common';
import { UserLoaderInterface } from 'modules/oauth2/domain/loaders';
import { UserInterface } from 'modules/oauth2/domain/payloaders';
import { InvalidUserException } from 'modules/oauth2/domain/exceptions';

@Injectable()
export class UserLoader implements UserLoaderInterface {
  async load(userId: string): Promise<UserInterface> {
    if (userId !== undefined) {
      return {
        id: '123',
        username: 'bob',
        email: 'bob'
      };
    }

    throw InvalidUserException.withId(userId);
  }
}
