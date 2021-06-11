import { Inject, UnauthorizedException } from '@nestjs/common';
import { Oauth2GrantStrategyInterface } from 'modules/tokens/domain';
import { Oauth2GrantStrategy } from 'modules/tokens/infrastructure/core/decorators';
import { OAuth2Request, OAuth2Response } from 'modules/tokens/application/dtos';
import { AccessTokenServiceInterface } from 'modules/tokens/domain/services';
import { AccessTokenEntity, ClientEntity } from 'modules/tokens/infrastructure/entities';
import { CreateAccessTokenCommand } from 'modules/tokens/infrastructure/commands';
import { CommandBus } from '@nestjs/cqrs';

@Oauth2GrantStrategy('refresh_token')
export class RefreshTokenStrategy implements Oauth2GrantStrategyInterface {
  /**
   * Constructor
   *
   * @param accessTokenRepository
   * @param commandBus
   */
  constructor(
    @Inject('AccessTokenServiceInterface')
    private readonly accessTokenRepository: AccessTokenServiceInterface,
    private readonly commandBus: CommandBus
  ) {}

  async validate(request: OAuth2Request, client: ClientEntity): Promise<boolean> {
    if (
      (client.clientSecret && client.clientSecret !== request.clientSecret) ||
      client.deletedAt !== null ||
      !client.grants.includes(request.grantType)
    ) {
      return false;
    }

    return true;
  }

  async getOauth2Response(request: OAuth2Request, client: ClientEntity): Promise<OAuth2Response> {
    const expiredToken = await this.accessTokenRepository.findByRefreshToken(request.refreshToken);

    if (expiredToken.refreshTokenExpiresAt < new Date(Date.now()) || expiredToken.client.clientId !== client.clientId) {
      throw new UnauthorizedException('You are not allowed to access the given resource');
    }

    // Create a new AccessToken
    const exp = (Date.now() + expiredToken.client.accessTokenLifetime * 1000) / 1000;
    const iat = Date.now() / 1000;
    const accessToken: AccessTokenEntity = await this.commandBus.execute(
      new CreateAccessTokenCommand(
        expiredToken.client.id,
        expiredToken.scope,
        exp,
        iat,
        {
          clientId: expiredToken.client.clientId,
          clientSecret: expiredToken.client.clientSecret,
          exp,
          iat,
          scopes: JSON.parse(expiredToken.scope)
        } as OAuth2Request,
        expiredToken.userId !== null ? expiredToken.userId : undefined
      )
    );

    return new OAuth2Response(
      accessToken.accessToken,
      accessToken.refreshToken,
      ~~((accessToken.accessTokenExpiresAt.getTime() - Date.now()) / 1000),
      ~~((accessToken.refreshTokenExpiresAt.getTime() - Date.now()) / 1000)
    );
  }
}
