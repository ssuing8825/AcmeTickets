import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { intervalToDuration, subSeconds } from 'date-fns';
import { BehaviorSubject, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'global-lib-duration-counter',
  templateUrl: './duration-counter.component.html',
  styleUrls: ['./duration-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DurationCounterComponent implements OnInit, OnChanges {
  private _durationSubject = new BehaviorSubject('0:0:0');
  private _shouldPauseSubject = new BehaviorSubject(false);
  private _totalDurationBeforePauseInSeconds = 0;

  private _startDateTime: Date = new Date();
  public shouldPauseAction$ = this._shouldPauseSubject.asObservable();

  public durationAction$ = this._durationSubject.asObservable();

  counterIncrementInterval$ = timer(0, 1000);

  durationOnInterval$ = this.counterIncrementInterval$.pipe(
    switchMap(() => {
      return this._tikDuration$(false);
    })
  );

  vm$ = this.shouldPauseAction$.pipe(
    switchMap((shouldPauseTimer) => {
      return !shouldPauseTimer ? this.durationOnInterval$ : this._tikDuration$(true);
    })
  );

  @Input() startDurationInSeconds!: number;

  @Input() set shouldPause(value: boolean) {
    this._shouldPauseSubject.next(value);
  }

  ngOnInit() {
    this._getStartTime();
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (this._isResumeTimer(changes)) {
  //   this._recalibrateStartTimeOnResume();
  //   }
  // }
  ngOnChanges(): void {
    this._recalibrateStartTimeOnResume();
  }

  private _getStartTime() {
    this._startDateTime = subSeconds(new Date(), this.startDurationInSeconds);
  }

  private _tikDuration$(isTimerPaused: boolean) {
    const duration = intervalToDuration({ start: this._startDateTime, end: new Date() });
    this._durationSubject.next(this._formatDuration(duration));
    if (!isTimerPaused) {
      this._totalDurationBeforePauseInSeconds = this._totalDurationBeforePauseInSeconds + 1;
    }
    return this.durationAction$;
  }

  private _formatDuration(duration: Duration) {
    const formatted = `${this._prependZeroIfSingleDigit(duration.hours)}${duration.hours}:${this._prependZeroIfSingleDigit(
      duration.minutes
    )}${duration.minutes}:${this._prependZeroIfSingleDigit(duration.seconds)}${duration.seconds}`;
    return formatted;
  }

  private _prependZeroIfSingleDigit(number: number = 0) {
    return number <= 9 ? '0' : '';
  }

  private _isResumeTimer(changes: SimpleChanges) {
    const change = changes['shouldPause'];
    return change && change.previousValue === true && change.currentValue === false;
  }

  private _recalibrateStartTimeOnResume() {
    this.startDurationInSeconds = this.startDurationInSeconds + this._totalDurationBeforePauseInSeconds;
    this._totalDurationBeforePauseInSeconds = 0;
    this._getStartTime();
  }
}
