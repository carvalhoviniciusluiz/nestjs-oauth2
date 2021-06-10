import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import * as crypto from 'crypto';
import * as selfsigned from 'selfsigned';
import { CreateClientCommand } from 'modules/oauth2/infrastructure/commands';
import { ClientServiceInterface } from 'modules/oauth2/domain/services';
import { ClientEntity } from 'modules/oauth2/infrastructure/entities';
import { ClientCreatedEvent } from 'modules/oauth2/infrastructure/events';

@CommandHandler(CreateClientCommand)
export class CreateClientHandler implements ICommandHandler<CreateClientCommand> {
  constructor(
    @Inject('ClientServiceInterface')
    private readonly clientRepository: ClientServiceInterface,
    private readonly eventBus: EventBus
  ) {}

  /**
   * Execute the create Client Command
   *
   * @param command
   */
  async execute(command: CreateClientCommand) {
    const client = new ClientEntity();
    client.name = command.name;
    client.clientId = command.clientId || uuid();
    if (!command.noSecret) {
      client.clientSecret = crypto.randomBytes(32).toString('hex');
    }

    client.scope = command.scope;
    client.accessTokenLifetime = command.accessTokenLifetime || 3600;
    client.refreshTokenLifetime = command.refreshTokenLifetime || 7200;
    client.grants = command.grants || ['client_credentials', 'refresh_token'];

    // generate keys
    const attrs = [{ name: 'commonName', value: command.name }];
    const pem = selfsigned.generate(attrs, { days: 365 });

    client.privateKey = pem.private;
    client.publicKey = pem.public;
    client.cert = pem.cert;

    const exp = new Date();
    exp.setDate(exp.getDate() + 365);
    client.certExpiresAt = exp;

    const createdClient = await this.clientRepository.create(client);

    // emit an access token created event
    this.eventBus.publish(
      new ClientCreatedEvent(createdClient.id, createdClient.name, createdClient.clientId, createdClient.certExpiresAt)
    );

    return createdClient;
  }
}
