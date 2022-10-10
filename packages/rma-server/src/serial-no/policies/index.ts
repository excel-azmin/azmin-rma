import { AssignSerialNoPoliciesService } from './assign-serial-no-policies/assign-serial-no-policies.service';
import { SerialNoHistoryPoliciesService } from './serial-no-history-policies/serial-no-history-policies.service';
import { SerialNoPoliciesService } from './serial-no-policies/serial-no-policies.service';

export const SerialNoPolicies = [
  AssignSerialNoPoliciesService,
  SerialNoHistoryPoliciesService,
  SerialNoPoliciesService,
];
