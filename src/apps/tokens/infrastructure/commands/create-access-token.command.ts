/**
 * Create an access token
 */
import { TokenRequest } from 'apps/tokens/application/dtos';

export class CreateAccessTokenCommand {
  constructor(
    public readonly clientId: string,
    public readonly scope: string,
    public readonly exp: number,
    public readonly iat: number,
    public readonly request: TokenRequest,
    public readonly userId?: string
  ) {}
}
