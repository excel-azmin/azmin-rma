import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DateTime } from 'luxon';
import { SettingsService } from '../system-settings/aggregates/settings/settings.service';

@Injectable()
export class LuxonProvider {
  constructor(private readonly settings: SettingsService) {}

  toFrappeServer(time: Date): Observable<string> {
    return this.settings.find().pipe(
      map(settings => {
        const formattedTime = DateTime.fromJSDate(time)
          .setZone(settings.timeZone)
          .toFormat('yyyy-MM-dd HH:mm:ss');
        return formattedTime;
      }),
    );
  }
}
