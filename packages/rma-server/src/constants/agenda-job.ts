import { SYSTEM_MANAGER } from './app-strings';

export const AGENDA_JOB_METADATA = {
  name: '',
  type: 'single',
  data: null,
  lastModifiedBy: null,
  nextRunAt: new Date(),
  token: null,
  priority: 0,
  inQueue: false,
  repeatInterval: null,
  repeatTimezone: null,
  lockedAt: null,
  lastRunAt: new Date(),
  lastFinishedAt: new Date(),
};

export function getParsedPostingDate(payload: {
  posting_date?: string;
  posting_time?: string;
}) {
  let date: Date;
  try {
    date = new Date(
      `${reversePosingDate(payload.posting_date)} ${
        payload.posting_time || '00:00:00'
      }`,
    );
  } catch {}
  if (date && isNaN(date?.getMilliseconds())) {
    date = new Date();
  }
  return date;
}

export function reversePosingDate(date: string) {
  const splitDate = date.split('-');
  return splitDate[0].length === 4
    ? splitDate.join()
    : splitDate.reverse().join('-');
}

export function getUserPermissions(req: {
  token: PermissionStateInterface;
}): PermissionStateInterface {
  const userPermissions: PermissionStateInterface = {
    name: req.token.name,
    fullName: req.token.fullName,
    email: req.token.email,
  };
  if (req.token.roles.includes(SYSTEM_MANAGER)) {
    return userPermissions;
  }
  return { ...userPermissions, ...req.token };
}

export interface PermissionStateInterface {
  name: string;
  fullName: string;
  email: string;
  warehouses?: string[];
  territories?: string[];
  roles?: string[];
}
