import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { MiniStatWidgetOptions } from './mini-stat-widget-options';

@Component({
  selector: 'global-lib-mini-stat-widget',
  templateUrl: './mini-stat-widget.component.html',
  styleUrls: ['./mini-stat-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniStatWidgetComponent implements AfterViewInit {
  private _showChartSubject = new BehaviorSubject(false);
  @Input() public options$!: Observable<MiniStatWidgetOptions>;

  public showChart$ = this._showChartSubject.asObservable();

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this._showChartSubject.next(true);
    }, 500);
  }
}
