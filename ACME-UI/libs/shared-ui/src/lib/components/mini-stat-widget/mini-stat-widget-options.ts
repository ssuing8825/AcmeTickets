import { Color } from '@swimlane/ngx-charts';

import { IMultiEntityData, NgxChartOptions } from '../../typings';

export class MiniStatWidgetOptions extends NgxChartOptions {
  public gain: number;
  public metaText: string;
  public total: number;
  public hideChart?: boolean;

  constructor(
    _name: string,
    _metaText: string,
    _total: number,
    _gain: number,
    _chartData: IMultiEntityData[],
    _colorScheme: Color,
    _hideChart?: boolean
  ) {
    super(_name, _chartData, _colorScheme);
    this.metaText = _metaText;
    this.total = _total;
    this.gain = _gain;
    this.hideChart = _hideChart;
  }
}
