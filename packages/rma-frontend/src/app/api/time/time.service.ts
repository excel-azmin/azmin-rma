import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { StorageService } from '../storage/storage.service';
import { TIME_ZONE } from '../../constants/storage';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  constructor(private readonly storage: StorageService) {}

  async getDateTime(time: Date) {
    const timeZone = await this.storage.getItem(TIME_ZONE);
    return DateTime.fromJSDate(time)
      .setZone(timeZone)
      .toFormat('yyyy-MM-dd HH:mm:ss');
  }

  async getDateAndTime(time: Date) {
    const timeZone = await this.storage.getItem(TIME_ZONE);
    return {
      date: DateTime.fromJSDate(time).setZone(timeZone).toFormat('yyyy-MM-dd'),
      time: DateTime.fromJSDate(time).setZone(timeZone).toFormat('HH:mm:ss'),
    };
  }
}
