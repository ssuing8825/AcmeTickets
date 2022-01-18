import { Color } from '@swimlane/ngx-charts';

export interface ISingleEntityData {
  name: string;
  value: number;
}
export interface IMultiEntityData {
  name: string;
  series: ISingleEntityData[];
}

export class NgxChartOptions {
  name: string;
  data: IMultiEntityData[] | ISingleEntityData[];
  colorScheme: Color;
  view?: [number, number];
  legend?: boolean = false;
  showLabels?: boolean = false;
  animations?: boolean = true;
  xAxis?: boolean = false;
  yAxis?: boolean = false;
  showYAxisLabel?: boolean = false;
  showXAxisLabel?: boolean = false;
  xAxisLabel?: string = '';
  yAxisLabel?: string = '';
  timeline?: boolean = false;
  constructor(_name: string, _chartData: IMultiEntityData[] | ISingleEntityData[], _colorScheme: Color) {
    this.name = _name;
    this.data = _chartData;
    this.colorScheme = _colorScheme;
  }
}
