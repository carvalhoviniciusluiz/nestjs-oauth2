import { Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { TokenGrantStrategy } from 'apps/tokens/infrastructure/decorators';
import { Oauth2GrantStrategyInterface } from 'apps/@core/protocols';
import { TokenRequest, TokenResponse } from 'apps/tokens/application/dtos';
import { AccessTokenEntity, ClientEntity } from 'apps/tokens/infrastructure/entities';
import { UserValidatorInterface } from 'apps/tokens/domain/validators';
import { CreateAccessTokenCommand } from 'apps/tokens/infrastructure/commands';

@TokenGrantStrategy('password')
export class PasswordStrategy implements Oauth2GrantStrategyInterface {
  /**
   * Constructor
   *
   * @param clientRepository
   * @param userValidator
   * @param commandBus
   */
  constructor(
    @Inject('UserValidatorInterface')
    private readonly userValidator: UserValidatorInterface,
    private readonly commandBus: CommandBus
  ) {}

  async validate(request: TokenRequest, client: ClientEntity): Promise<boolean> {
    if (
      (client.clientSecret && client.clientSecret !== request.clientSecret) ||
      client.deletedAt !== null ||
      !client.grants.includes(request.grantType)
    ) {
      return false;
    }

    return true;
  }

  async getOauth2Response(request: TokenRequest, client: ClientEntity): Promise<TokenResponse> {
    const user = await this.userValidator.validate(request.username, request.password);
    const requestScopes = typeof request.scopes === 'string' ? [request.scopes] : request.scopes;
    const accessToken: AccessTokenEntity = await this.commandBus.execute(
      new CreateAccessTokenCommand(client.id, JSON.stringify(requestScopes), request.exp, request.iat, request, user.id)
    );

    return new TokenResponse(
      accessToken.accessToken,
      accessToken.refreshToken,
      ~~((accessToken.accessTokenExpiresAt.getTime() - Date.now()) / 1000),
      ~~((accessToken.refreshTokenExpiresAt.getTime() - Date.now()) / 1000)
    );
  }
}
