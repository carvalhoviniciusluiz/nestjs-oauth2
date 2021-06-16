import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Inject,
  Post,
  UseInterceptors
} from '@nestjs/common';
import { StrategyRegistry } from 'apps/tokens/infrastructure';
import { ClientServiceInterface } from 'apps/tokens/domain';
import { TokenRequest } from 'apps/tokens/application';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class TokensController {
  /**
   * Constructor
   *
   * @param clientRepository
   * @param strategyRegistry
   */
  constructor(
    @Inject('ClientServiceInterface')
    private readonly clientService: ClientServiceInterface,
    private readonly strategyRegistry: StrategyRegistry
  ) {}

  @Post()
  async token(@Body() request: TokenRequest) {
    const client = await this.clientService.findByClientId(request.clientId);

    if (!(await this.strategyRegistry.validate(request, client))) {
      throw new ForbiddenException('You are not allowed to access the given resource');
    }

    return await this.strategyRegistry.getOauth2Response(request, client);
  }
}
