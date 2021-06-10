import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientCreatedEvent } from './client-created.event';

@EventsHandler(ClientCreatedEvent)
export class ClientCreatedEventHandler implements IEventHandler<ClientCreatedEvent> {
  handle(event: ClientCreatedEvent) {
    console.log({ event });
  }
}
