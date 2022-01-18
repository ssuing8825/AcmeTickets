import { Pipe, PipeTransform } from '@angular/core';

import { addSeconds, intervalToDuration } from 'date-fns/esm';

@Pipe({
  name: 'globalLibSecondsToDuration',
})
export class SecondsToDurationPipe implements PipeTransform {
  transform(value: number): string {
    try {
      if (value === null || value === undefined) {
        return '00s';
      }
      const nowDateTime = new Date();
      const nowTimeInEpochMilliseconds = nowDateTime.getTime();
      const durationAddedTimeInMilliseconds = addSeconds(nowDateTime, value).getTime();
      const duration = intervalToDuration({ start: nowTimeInEpochMilliseconds, end: durationAddedTimeInMilliseconds });
      const { days = 0, hours = 0, minutes = 0, seconds = 0 } = duration;
      const dd = days !== 0 ? (this._isSingleDigit(days) ? `0${days}d:` : `${days}d:`) : '';
      const hh = hours !== 0 ? (this._isSingleDigit(hours) ? `0${hours}h:` : `${hours}h:`) : '';
      const mm = minutes !== 0 ? (this._isSingleDigit(minutes) ? `0${minutes}m:` : `${minutes}m:`) : '';
      const ss = seconds !== 0 ? (this._isSingleDigit(seconds) ? `0${seconds}` : `${seconds}s`) : '';
      return `${dd}${hh}${mm}${ss}`;
    } catch (error) {
      throw new Error(error as string);
    }
  }
  private _isSingleDigit(number: number) {
    return number < 10;
  }
}
