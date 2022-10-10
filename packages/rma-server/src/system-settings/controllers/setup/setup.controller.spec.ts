import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { SetupController } from './setup.controller';
import { SetupService } from './setup.service';

describe('SetupController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [SetupController],
      providers: [
        { provide: SetupService, useValue: {} },
        { provide: HttpService, useValue: {} },
      ],
    }).compile();
  });

  describe('message', () => {
    it('should be defined', () => {
      const settingsController = app.get<SetupController>(SetupController);
      expect(settingsController).toBeDefined();
    });
  });
});
