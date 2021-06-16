import { Oauth2GrantStrategyInterface } from 'apps/@core/protocols';
import { AuthorizeGrantStrategy } from 'apps/authorize/infrastructure/decorators';

@AuthorizeGrantStrategy('code')
export class CodeStrategy implements Oauth2GrantStrategyInterface {
  async validate(request: any, client: any): Promise<boolean> {
    if (
      client.clientSecret !== request.clientSecret ||
      !request.clientSecret ||
      client.deletedAt !== null ||
      !client.grants.includes(request.grantType)
    ) {
      return false;
    }

    console.log({ request, client });
  }

  async getOauth2Response(request: any, client: any): Promise<any> {
    console.log({ request, client });
  }
}
