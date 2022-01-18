import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SubscribeModule } from '@ngneat/subscribe';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ANGULAR_MATERIAL_MODULES } from '../angular-material-modules';
import { ANGULAR_MODULES } from '../angular-modules';
import { LetDirective, NgVarDirective } from '../directives';
import { DynamicTemplateHostDirective } from '../directives/dynamic-template-host.directive';
import {
  CamelCaseToWordsPipe,
  DynamicPipe,
  DynamicVisibilityHandlerPipe,
  ReadObjectByStringPathPipe,
  RouteWithIdPipe,
  SecondsToDurationPipe,
  TableDisplayColumnNamesPipe,
} from '../pipes';
import { PRIME_NG_DIRECTIVES, PRIME_NG_MODULES, PRIME_NG_SERVICES } from '../prime-ng-modules';

import {
  AreaChartComponent,
  ConfirmBoxComponent,
  DurationCounterComponent,
  DynamicTemplateComponent,
  LineChartComponent,
  MdTableCardComponent,
  MiniStatWidgetComponent,
  PrimeNgTableComponent,
} from '.';

const NGX_MODULES = [NgxChartsModule, NgxDatatableModule];

const GLOBAL_LIB_COMPONENTS = [
  AreaChartComponent,
  ConfirmBoxComponent,
  DurationCounterComponent,
  DynamicTemplateComponent,
  LineChartComponent,
  MdTableCardComponent,
  MiniStatWidgetComponent,
  PrimeNgTableComponent,
];
const THIRD_PARTY_MODULES = [FontAwesomeModule, SubscribeModule, ...NGX_MODULES];
const PIPES = [
  ReadObjectByStringPathPipe,
  TableDisplayColumnNamesPipe,
  RouteWithIdPipe,
  DynamicPipe,
  DynamicVisibilityHandlerPipe,
  CamelCaseToWordsPipe,
  SecondsToDurationPipe,
];
const DIRECTIVES = [LetDirective, NgVarDirective, DynamicTemplateHostDirective];

@NgModule({
  declarations: [...GLOBAL_LIB_COMPONENTS, ...PIPES, ...DIRECTIVES],
  imports: [...ANGULAR_MODULES, ...ANGULAR_MATERIAL_MODULES, ...PRIME_NG_MODULES, ...PRIME_NG_DIRECTIVES, ...THIRD_PARTY_MODULES],
  exports: [
    ...ANGULAR_MODULES,
    ...ANGULAR_MATERIAL_MODULES,
    ...PRIME_NG_MODULES,
    ...PRIME_NG_DIRECTIVES,
    ...GLOBAL_LIB_COMPONENTS,
    ...THIRD_PARTY_MODULES,
    ...PIPES,
    ...DIRECTIVES,
  ],
  providers: [...PRIME_NG_SERVICES],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
