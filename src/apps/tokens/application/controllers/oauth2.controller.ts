import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Inject,
  Post,
  UseInterceptors
} from '@nestjs/common';
import { Oauth2GrantStrategyRegistry } from 'apps/tokens/infrastructure';
import { ClientServiceInterface } from 'apps/tokens/domain';
import { OAuth2Request } from 'apps/tokens/application';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class Oauth2Controller {
  /**
   * Constructor
   *
   * @param clientRepository
   * @param strategyRegistry
   */
  constructor(
    @Inject('ClientServiceInterface')
    private readonly clientService: ClientServiceInterface,
    private readonly strategyRegistry: Oauth2GrantStrategyRegistry
  ) {}

  @Post()
  async token(@Body() request: OAuth2Request) {
    const client = await this.clientService.findByClientId(request.clientId);

    if (!(await this.strategyRegistry.validate(request, client))) {
      throw new ForbiddenException('You are not allowed to access the given resource');
    }

    return await this.strategyRegistry.getOauth2Response(request, client);
  }
}
