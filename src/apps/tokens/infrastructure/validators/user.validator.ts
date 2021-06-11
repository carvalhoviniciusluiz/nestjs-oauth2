import { Injectable } from '@nestjs/common';
import { UserValidatorInterface } from 'apps/tokens/domain/validators';
import { UserInterface } from 'apps/tokens/domain/payloaders';
import { InvalidUserException } from 'apps/tokens/domain/exceptions';

@Injectable()
export class UserValidator implements UserValidatorInterface {
  validate(username: string, password: string): Promise<UserInterface> {
    if (username === 'bob' && password === 'bob') {
      const user = {
        id: '123',
        username: 'bob',
        email: 'bob@change.me'
      };

      return Promise.resolve(user);
    }

    throw InvalidUserException.withUsernameAndPassword(username, password);
  }
}
