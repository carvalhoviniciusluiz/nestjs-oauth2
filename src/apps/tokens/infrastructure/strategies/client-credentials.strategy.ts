import { CommandBus } from '@nestjs/cqrs';
import { Oauth2GrantStrategyInterface } from 'apps/@core/protocols';
import { TokenRequest, TokenResponse } from 'apps/tokens/application/dtos';
import { CreateAccessTokenCommand } from 'apps/tokens/infrastructure/commands';
import { AccessTokenEntity, ClientEntity } from 'apps/tokens/infrastructure/entities';
import { TokenGrantStrategy } from 'apps/tokens/infrastructure/decorators';

@TokenGrantStrategy('client_credentials')
export class ClientCredentialsStrategy implements Oauth2GrantStrategyInterface {
  /**
   * Constructor
   *
   * @param commandBus
   */
  constructor(private readonly commandBus: CommandBus) {}

  async validate(request: TokenRequest, client: ClientEntity): Promise<boolean> {
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

  async getOauth2Response(request: TokenRequest, client: ClientEntity): Promise<TokenResponse> {
    const requestScopes = typeof request.scopes === 'string' ? [request.scopes] : request.scopes;

    const accessToken: AccessTokenEntity = await this.commandBus.execute(
      new CreateAccessTokenCommand(client.id, JSON.stringify(requestScopes), request.exp, request.iat, request)
    );

    return new TokenResponse(
      accessToken?.accessToken,
      accessToken?.refreshToken,
      ~~((accessToken?.accessTokenExpiresAt.getTime() - Date.now()) / 1000),
      ~~((accessToken?.refreshTokenExpiresAt.getTime() - Date.now()) / 1000)
    );
  }
}
