import { Injectable } from '@nestjs/common';
import { UserLoaderInterface } from 'modules/tokens/domain/loaders';
import { UserInterface } from 'modules/tokens/domain/payloaders';
import { InvalidUserException } from 'modules/tokens/domain/exceptions';

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
