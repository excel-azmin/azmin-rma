import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { SERVICE } from '../src/constants/app-strings';
import { SetupService } from '../src/system-settings/controllers/setup/setup.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const reqResp = {
    uuid: '19421784-bb3d-4b4a-8994-dfe8f3eddf5a',
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: SetupService,
          useValue: {
            async getInfo() {
              return reqResp;
            },
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', done => {
    return request(app.getHttpServer())
      .get('/')
      .expect({ service: SERVICE })
      .end(done);
  });

  afterAll(async () => {
    await app.close();
  });
});
