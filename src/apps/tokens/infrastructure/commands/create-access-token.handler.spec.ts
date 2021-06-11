import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { v4 as uuid } from 'uuid';
import { CreateAccessTokenCommand, CreateAccessTokenHandler } from '../commands';
import { OAuth2Request } from '../../application/dtos';
import { AccessTokenEntity, ClientEntity } from '../entities';
import { AccessTokenCreatedEvent } from '../events';

function mockDateNow() {
  // mock now = 1462361249717ms = 4th May 2016
  return 1462361249717;
}

const originalDateNow = Date.now;

describe('Create AccessToken Command Handler', () => {
  let app: TestingModule;
  let handler: CreateAccessTokenHandler;
  let eventBus: EventBus;

  const accessTokenServiceMock = {
    create(accessToken: AccessTokenEntity) {
      accessToken.id = uuid();
      return accessToken;
    }
  };

  const clientServiceMock = {
    find(id: string) {
      const client = new ClientEntity();
      client.id = id;
      client.accessTokenLifetime = 3600;
      client.refreshTokenLifetime = 86400;

      return client;
    }
  };

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        CreateAccessTokenHandler,
        { provide: 'AccessTokenServiceInterface', useValue: accessTokenServiceMock },
        { provide: 'ClientServiceInterface', useValue: clientServiceMock }
      ]
    }).compile();

    eventBus = app.get<EventBus>(EventBus);
    handler = app.get<CreateAccessTokenHandler>(CreateAccessTokenHandler);
  });

  beforeEach(function () {
    Date.now = mockDateNow;
  });

  afterEach(function () {
    Date.now = originalDateNow;
  });

  it('"CreateAccessTokenHandler::execute": should create the AccessToken', async () => {
    const serviceSpy = jest.spyOn(accessTokenServiceMock, 'create');

    await handler.execute(
      new CreateAccessTokenCommand('client-1', '["app-1", "app-2"]', Date.now() + 3600, Date.now(), {
        grantType: 'client_credentials',
        clientId: 'client-1',
        clientSecret: 'client-secret',
        clientToken: 'client-token',
        exp: Date.now() + 3600,
        iat: Date.now(),
        scopes: ['app-1', 'app-2']
      } as OAuth2Request)
    );

    expect(serviceSpy).toBeCalledWith(expect.any(AccessTokenEntity));
    serviceSpy.mockRestore();
  });

  it('"CreateAccessTokenHandler::execute": should emit an AccessTokenCreatedEvent', async () => {
    const publishSpy = jest.spyOn(eventBus, 'publish');

    await handler.execute(
      new CreateAccessTokenCommand('client-1', '["app-1", "app-2"]', Date.now() + 3600, Date.now(), {
        grantType: 'client_credentials',
        clientId: 'client-1',
        clientSecret: 'client-secret',
        clientToken: 'client-token',
        exp: Date.now() + 3600,
        iat: Date.now(),
        scopes: ['app-1', 'app-2']
      } as OAuth2Request)
    );

    expect(publishSpy).toBeCalledWith(expect.any(AccessTokenCreatedEvent));

    publishSpy.mockRestore();
  });

  it('"CreateAccessTokenHandler::execute": should set the token expiration', async () => {
    const serviceSpy = jest.spyOn(accessTokenServiceMock, 'create');
    const exp = (Date.now() + 600000) / 1000;

    await handler.execute(
      new CreateAccessTokenCommand('client-1', '["app-1", "app-2"]', exp, Date.now(), {
        grantType: 'client_credentials',
        clientId: 'client-1',
        clientSecret: 'client-secret',
        clientToken: 'client-token',
        exp: exp,
        iat: Date.now(),
        scopes: ['app-1', 'app-2']
      } as OAuth2Request)
    );

    expect(serviceSpy).toBeCalledWith(
      expect.objectContaining({
        accessTokenExpiresAt: new Date(exp * 1000),
        refreshTokenExpiresAt: new Date(Date.now() + 86400000)
      })
    );

    serviceSpy.mockRestore();
  });

  it('"CreateAccessTokenHandler::execute": should set the max token expiration from client', async () => {
    const serviceSpy = jest.spyOn(accessTokenServiceMock, 'create');
    const exp = Date.now() + 15000000;

    await handler.execute(
      new CreateAccessTokenCommand('client-1', '["app-1", "app-2"]', exp, Date.now(), {
        grantType: 'client_credentials',
        clientId: 'client-1',
        clientSecret: 'client-secret',
        clientToken: 'client-token',
        exp: exp,
        iat: Date.now(),
        scopes: ['app-1', 'app-2']
      } as OAuth2Request)
    );

    expect(serviceSpy).toBeCalledWith(
      expect.objectContaining({
        accessTokenExpiresAt: new Date(Date.now() + 3600000),
        refreshTokenExpiresAt: new Date(Date.now() + 86400000)
      })
    );

    serviceSpy.mockRestore();
  });

  it('"CreateAccessTokenHandler::execute": should set user in the access token', async () => {
    const exp = Date.now() + 15000000;

    const token = await handler.execute(
      new CreateAccessTokenCommand(
        'client-1',
        '["app-1", "app-2"]',
        exp,
        Date.now(),
        {
          grantType: 'client_credentials',
          clientId: 'client-1',
          clientSecret: 'client-secret',
          clientToken: 'client-token',
          exp: exp,
          iat: Date.now(),
          scopes: ['app-1', 'app-2']
        } as OAuth2Request,
        'user-1'
      )
    );

    expect(token.userId).not.toBeNull();
  });
});
