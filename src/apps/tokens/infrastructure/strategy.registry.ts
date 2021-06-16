import { HttpException, Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Oauth2GrantStrategyInterface } from 'apps/@core/protocols';
import { TokenRequest, TokenResponse } from 'apps/tokens/application/dtos';
import { ClientEntity } from 'apps/tokens/infrastructure/entities';
import { TOKEN_STRATEGY_METADATA } from 'app.constants';

export type Oauth2GrantStrategyType = Type<Oauth2GrantStrategyInterface>;

/**
 * This is the main class used to execute strategies
 */
@Injectable()
export class StrategyRegistry {
  /**
   * Store all available granted strategy
   */
  private registry: { [s: string]: Oauth2GrantStrategyInterface } = {};

  constructor(private readonly moduleRef: ModuleRef) {}

  /**
   * Register a single strategy
   *
   * @param strategy
   */
  protected registerStrategy(strategy: Oauth2GrantStrategyType): void {
    const instance = this.moduleRef.get(strategy, { strict: false });
    if (!instance) {
      return;
    }

    const strategyName = this.reflectStrategyName(strategy);
    this.registry[strategyName] = instance as Oauth2GrantStrategyInterface;
  }

  /**
   * Register all strategies with the decorator
   *
   * @param strategies
   */
  register(strategies: Oauth2GrantStrategyType[] = []) {
    strategies.forEach(strategy => this.registerStrategy(strategy));
  }

  /**
   * Validate the client associated to the given request
   *
   * @param request
   * @param client
   */
  async validate(request: TokenRequest, client: ClientEntity): Promise<boolean> {
    if (!(request.grantType in this.registry)) {
      throw new HttpException(`Cannot find the a strategy for the grant type "${request.grantType}"`, 400);
    }

    return await this.registry[request.grantType].validate(request, client);
  }

  /**
   * Get the response
   *
   * @param request
   * @param client
   */
  async getOauth2Response(request: TokenRequest, client: ClientEntity): Promise<TokenResponse> {
    if (!(request.grantType in this.registry)) {
      throw new HttpException(`Cannot find the a strategy for the grant type "${request.grantType}"`, 400);
    }

    return await this.registry[request.grantType].getOauth2Response(request, client);
  }

  private reflectStrategyName(strategy: Oauth2GrantStrategyType): string {
    return Reflect.getMetadata(TOKEN_STRATEGY_METADATA, strategy);
  }
}
