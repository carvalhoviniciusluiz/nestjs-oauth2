import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizeController } from './authorize.controller';
import { AuthorizeService } from '../services/authorize.service';

describe('AppController', () => {
  let appController: AuthorizeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthorizeController],
      providers: [AuthorizeService]
    }).compile();

    appController = app.get<AuthorizeController>(AuthorizeController);
  });

  describe('root', () => {
    it('should return "Hello Authorized!"', () => {
      expect(appController.getHello()).toBe('Hello Authorized!');
    });
  });
});
