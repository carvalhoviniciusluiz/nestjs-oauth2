import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * Main object used to transport data
 */
export class AuthorizeRequest {
  @ApiProperty({
    type: String,
    description: 'The type of grant you are requesting, must be "code"',
    required: true
  })
  @IsNotEmpty()
  @Expose({ name: 'response_type' })
  responseType: string;

  @ApiProperty({
    type: String,
    description: 'The API Key given by the application',
    required: true
  })
  @IsNotEmpty()
  @Expose({ name: 'client_id' })
  clientId: string;

  @ApiProperty({
    type: String,
    description: 'The redirection endpoint.'
  })
  @Expose({ name: 'redirect_uri' })
  redirectUri?: string;

  @ApiProperty({
    type: String,
    description: 'The list of the permissions (tpApps) that the application requests.',
    isArray: true
  })
  @Expose({ name: 'scopes' })
  scopes?: string | string[];

  @ApiProperty({
    type: String,
    description: 'The authorization server includes this value when redirecting the user-agent back to the client.'
  })
  @Expose({ name: 'state' })
  state?: string | number;
}
