import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { NgxChartOptions } from '../../typings/ngx-chart-options';

@Component({
  selector: 'global-lib-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent implements AfterViewInit {
  @Input() public options$!: Observable<NgxChartOptions>;
  public showChartSubject = new BehaviorSubject(false);
  public showChart$ = this.showChartSubject.asObservable();

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.showChartSubject.next(true);
    }, 500);
  }
}
