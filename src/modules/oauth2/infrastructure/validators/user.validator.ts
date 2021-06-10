import { Injectable } from '@nestjs/common';
import { UserValidatorInterface } from 'modules/oauth2/domain/validators';
import { UserInterface } from 'modules/oauth2/domain/payloads';

@Injectable()
export class UserValidator implements UserValidatorInterface {
  validate(username: string, password: string): Promise<UserInterface> {
    console.log({ username, password });

    const user: UserInterface = {
      id: 'xxxx',
      username: 'xxxx',
      email: 'xxxx@xxx.com'
    };

    return Promise.resolve(user);
  }
}
