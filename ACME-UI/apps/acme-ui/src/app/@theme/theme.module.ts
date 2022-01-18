import { ModuleWithProviders, NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { SharedUiModule } from '@globalLib/shared-ui';

import { SharedModule } from '@shared/shared.module';

import { DefaultLayoutComponent } from './components/default-layout/default-layout.component';
import { MenuListItemComponent } from './components/menu-list-item';
import { SideNavService } from './components/side-nav/side-nav.service';
import { FooterComponent, HeaderComponent, SideNavComponent, SpinnerComponent } from './components';
import { ThemeService } from './theme.service';

const ANGULAR_MODULES: never[] = [];

const THIRD_PARTY_MODULES = [FontAwesomeModule];

const NGX_MODULES = [NgxChartsModule, NgxDatatableModule];

const COMPONENTS = [DefaultLayoutComponent, FooterComponent, HeaderComponent, SideNavComponent, SpinnerComponent, MenuListItemComponent];

@NgModule({
  imports: [...ANGULAR_MODULES, ...NGX_MODULES, ...THIRD_PARTY_MODULES, SharedUiModule, SharedModule],
  exports: [...COMPONENTS, ...NGX_MODULES, ...THIRD_PARTY_MODULES],
  declarations: [...COMPONENTS],
  providers: [ThemeService, SideNavService],
})
export class ThemeModule {
  public static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [],
    };
  }
}
