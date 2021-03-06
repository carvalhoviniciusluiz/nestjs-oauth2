import { UserInterface } from '../payloaders/user.interface';

/**
 * Validates that the usernanme exists and has the given password
 */
export interface UserValidatorInterface {
  /**
   * Implement this method to validate the user existence
   *
   * @param username
   * @param password
   *
   * @return UserInterface
   * @throws InvalidUserException
   */
  validate(username: string, password: string): Promise<UserInterface>;
}
