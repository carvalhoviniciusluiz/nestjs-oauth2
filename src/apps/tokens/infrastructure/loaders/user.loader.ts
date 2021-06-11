import { Injectable } from '@nestjs/common';
import { UserLoaderInterface } from 'apps/tokens/domain/loaders';
import { UserInterface } from 'apps/tokens/domain/payloaders';
import { InvalidUserException } from 'apps/tokens/domain/exceptions';

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
