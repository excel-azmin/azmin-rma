import * as Agenda from 'agenda';
import { Provider } from '@nestjs/common';

import {
  ConfigService,
  MONGO_URI_PREFIX,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
} from '../../config/config.service';

export const AGENDA_TOKEN = 'AgendaProvider';
export const MAJORITY = 'majority';

export const AgendaProvider: Provider = {
  provide: AGENDA_TOKEN,
  useFactory: async (config: ConfigService) => {
    const mongoUriPrefix = config.get(MONGO_URI_PREFIX) || 'mongodb';
    const agenda = new Agenda({
      db: {
        address: `${mongoUriPrefix}://${config.get(DB_USER)}:${config.get(
          DB_PASSWORD,
        )}@${config.get(DB_HOST)}/${config.get(DB_NAME)}`,
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          w: MAJORITY,
          autoReconnect: false,
          reconnectTries: 0,
          reconnectInterval: 0,
        },
      },
    });
    await agenda.start();
    return agenda;
  },
  inject: [ConfigService],
};
