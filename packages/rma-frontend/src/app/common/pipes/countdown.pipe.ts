import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime',
})
export class CountDownPipe implements PipeTransform {
  transform(value: number): string {
    if (value < 0) {
      return 'Session Expired';
    }
    const minutes: number = Math.floor(value / 60);
    return (
      ('00' + minutes).slice(-2) +
      ':' +
      ('00' + Math.floor(value - minutes * 60)).slice(-2)
    );
  }
}
