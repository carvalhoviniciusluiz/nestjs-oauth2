import { CommandBus } from '@nestjs/cqrs';
import { OAuth2Request, OAuth2Response } from 'modules/tokens/application/dtos';
import { Oauth2GrantStrategyInterface } from 'modules/tokens/domain/strategies';
import { CreateAccessTokenCommand } from 'modules/tokens/infrastructure/commands';
import { AccessTokenEntity, ClientEntity } from 'modules/tokens/infrastructure/entities';
import { Oauth2GrantStrategy } from 'modules/tokens/infrastructure/core/decorators';

@Oauth2GrantStrategy('client_credentials')
export class ClientCredentialsStrategy implements Oauth2GrantStrategyInterface {
  /**
   * Constructor
   *
   * @param commandBus
   */
  constructor(private readonly commandBus: CommandBus) {}

  async validate(request: OAuth2Request, client: ClientEntity): Promise<boolean> {
    if (
      client.clientSecret !== request.clientSecret ||
      !request.clientSecret ||
      client.deletedAt !== null ||
      !client.grants.includes(request.grantType)
    ) {
      return false;
    }

    const clientScopes: string[] = JSON.parse(client.scope);

    const requestScopes = typeof request.scopes === 'string' ? [request.scopes] : request.scopes;

    return requestScopes?.every(scope => clientScopes.includes(scope));
  }

  async getOauth2Response(request: OAuth2Request, client: ClientEntity): Promise<OAuth2Response> {
    const requestScopes = typeof request.scopes === 'string' ? [request.scopes] : request.scopes;

    const accessToken: AccessTokenEntity = await this.commandBus.execute(
      new CreateAccessTokenCommand(client.id, JSON.stringify(requestScopes), request.exp, request.iat, request)
    );

    return new OAuth2Response(
      accessToken?.accessToken,
      accessToken?.refreshToken,
      ~~((accessToken?.accessTokenExpiresAt.getTime() - Date.now()) / 1000),
      ~~((accessToken?.refreshTokenExpiresAt.getTime() - Date.now()) / 1000)
    );
  }
}
