import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { NgxChartOptions } from '../../typings';

@Component({
  selector: 'global-lib-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaChartComponent implements AfterViewInit {
  @Input() public options$!: Observable<NgxChartOptions>;
  public showChartSubject = new BehaviorSubject(false);
  public showChart$ = this.showChartSubject.asObservable();

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.showChartSubject.next(true);
    }, 500);
  }
}
