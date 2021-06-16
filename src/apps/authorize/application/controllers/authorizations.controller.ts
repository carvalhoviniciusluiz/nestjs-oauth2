import { Body, Controller, ForbiddenException, Inject, Post } from '@nestjs/common';
import { ClientEntity } from 'apps/tokens/infrastructure';
import { AuthorizeService, StrategyRegistry } from '../../infrastructure';
import { AuthorizeRequest } from '../dtos';

@Controller()
export class AuthorizationsController {
  /**
   * Constructor
   *
   * @param clientRepository
   * @param strategyRegistry
   */
  constructor(
    // @Inject('ClientServiceInterface')
    // private readonly clientService: ClientServiceInterface,
    private readonly strategyRegistry: StrategyRegistry
  ) {}

  // constructor(
  //   @Inject('AuthorizeServiceInterface')
  //   private readonly authorizeService: AuthorizeService
  // ) {}

  @Post()
  async authorize(@Body() request: AuthorizeRequest) {
    console.log(request);

    // const client = await this.clientService.findByClientId(request.clientId);

    if (!(await this.strategyRegistry.validate(request, new ClientEntity()))) {
      throw new ForbiddenException('You are not allowed to access the given resource');
    }

    return await this.strategyRegistry.getOauth2Response(request, new ClientEntity());

    // return this.authorizeService.getHello();
  }
}
