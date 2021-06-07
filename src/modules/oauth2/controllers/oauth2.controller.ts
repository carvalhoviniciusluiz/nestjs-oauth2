import { Body, ClassSerializerInterceptor, Controller, Inject, Post, UseInterceptors } from '@nestjs/common';
import { ClientServiceInterface } from '../domain';
import { OAuth2Request } from '../dto';

@Controller('oauth2')
@UseInterceptors(ClassSerializerInterceptor)
export class Oauth2Controller {
  /**
   * Constructor
   *
   * @param clientRepository
   */
  constructor(
    @Inject('ClientServiceInterface')
    private readonly clientService: ClientServiceInterface
  ) {}

  @Post('token')
  async token(@Body() request: OAuth2Request) {
    console.log(request);

    const client = await this.clientService.findByClientId(request.clientId);
    console.log(client);
  }
}
