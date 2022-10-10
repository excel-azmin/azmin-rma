import { JobQueueAggregateService } from './job-queue-aggregate/job-queue-aggregate.service';
import { SerialBatchService } from './serial-batch/serial-batch.service';
import { SyncAggregateService } from './sync-aggregate/sync-aggregate.service';

export const SyncAggregateManager = [
  JobQueueAggregateService,
  SerialBatchService,
  SyncAggregateService,
];
