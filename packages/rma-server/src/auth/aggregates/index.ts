import { ClientTokenManagerService } from './client-token-manager/client-token-manager.service';
import { ConnectService } from './connect/connect.service';
import { ConnectedDeviceService } from './connected-device/connected-device.service';

export const AuthAggregates = [
  ConnectService,
  ClientTokenManagerService,
  ConnectedDeviceService,
];
