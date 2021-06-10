import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AccessTokenCreatedEvent } from './access-token-created.event';

@EventsHandler(AccessTokenCreatedEvent)
export class AccessTokenCreatedEventHandler implements IEventHandler<AccessTokenCreatedEvent> {
  handle(event: AccessTokenCreatedEvent) {
    console.log({ event });
  }
}
