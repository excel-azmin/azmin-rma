import { Column, ObjectIdColumn, ObjectID, Entity } from 'typeorm';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.entity';
import { TokenCache } from '../../../auth/entities/token-cache/token-cache.entity';

export class DataImportSuccessResponse {
  dataImportName?: string;
  file_name?: string;
  file_url?: string;
}

export class JobData {
  payload: any;
  settings: ServerSettings;
  type: string;
  parent: string;
  token: TokenCache;
  uuid: string;
  exported?: boolean;
  status?: string;
  lastError?: any;
  dataImport?: DataImportSuccessResponse;
}

@Entity({ name: 'agendaJobs' })
export class AgendaJob {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  data: JobData;

  @Column()
  failedAt: any;

  @Column()
  failCount: any;

  @Column()
  failReason: any;

  @Column()
  lastModifiedBy: Date;

  @Column()
  nextRunAt: Date;

  @Column()
  priority: number;

  @Column()
  repeatInterval: string;

  @Column()
  repeatTimezone: string;

  @Column()
  lockedAt: Date;

  @Column()
  lastRunAt: Date;

  @Column()
  lastFinishedAt: Date;
}
