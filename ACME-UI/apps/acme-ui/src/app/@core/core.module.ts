import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedUiModule } from '@globalLib/shared-ui';

import { HelperService } from '@shared/services/helper.service';

import { ThemeModule } from '@theme/theme.module';

import { httpInterceptorProviders } from './interceptors/index';
import { CoreService } from './core.service';
import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';
import { ErrorLoggerService, HttpErrorHandlerService, MockDataService } from './utils';

const ANGULAR_MODULES = [CommonModule, RouterModule];

@NgModule({
  imports: [...ANGULAR_MODULES, ThemeModule, SharedUiModule],
  exports: [],
  declarations: [],
  providers: [HelperService, ...httpInterceptorProviders, ErrorLoggerService, HttpErrorHandlerService, CoreService, MockDataService],
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  public static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [],
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
