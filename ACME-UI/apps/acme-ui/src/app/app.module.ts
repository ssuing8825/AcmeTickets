import { OverlayContainer } from '@angular/cdk/overlay';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HotToastModule } from '@ngneat/hot-toast';

import { SharedUiModule } from '@globalLib/shared-ui';

import { CoreModule } from '@core/core.module';

import { ThemeModule } from '@theme/theme.module';
import { ThemeService } from '@theme/theme.service';

import { AuthService } from './auth/auth.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

const ANGULAR_MODULES = [CommonModule, BrowserAnimationsModule, FormsModule, HttpClientModule, ReactiveFormsModule, AppRoutingModule];

const CUSTOM_MODULES = [CoreModule, ThemeModule];
const THIRD_PARTY_MODULES = [HotToastModule.forRoot()];

@NgModule({
  declarations: [AppComponent],
  imports: [...ANGULAR_MODULES, ...CUSTOM_MODULES, ...THIRD_PARTY_MODULES, SharedUiModule],
  exports: [...CUSTOM_MODULES, ...ANGULAR_MODULES],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {
  // #region Constructors (1)

  constructor(overlayContainer: OverlayContainer, private _themeService: ThemeService) {
    this._themeService.isDarkTheme$.subscribe((isDarkTheme) => {
      if (isDarkTheme) {
        overlayContainer.getContainerElement().classList.add('.dark-theme');
      }
    });
  }

  // #endregion Constructors (1)
}
