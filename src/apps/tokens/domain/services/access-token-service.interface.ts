import { AccessTokenEntity } from 'apps/tokens/infrastructure/entities';

/**
 * Main interface you have to implement if you want to deal with access tokens in your
 * Application
 */
export interface AccessTokenServiceInterface {
  /**
   * Find by access token
   *
   * @param accessToken
   *
   * @throws AccessTokenNotFoundException
   */
  findByAccessToken(accessToken: string): Promise<AccessTokenEntity>;

  /**
   * Find by access token
   *
   * @param refreshToken
   *
   * @throws AccessTokenNotFoundException
   */
  findByRefreshToken(refreshToken: string): Promise<AccessTokenEntity>;

  /**
   * Register a new access token into the storage
   *
   * @param accessToken
   */
  create(accessToken: AccessTokenEntity): Promise<AccessTokenEntity>;
}
