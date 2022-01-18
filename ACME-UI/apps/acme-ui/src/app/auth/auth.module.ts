import { NgModule } from '@angular/core';

import { SharedUiModule } from '@globalLib/shared-ui';

import { ThemeModule } from '@theme/theme.module';

import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  imports: [SharedUiModule, AuthRoutingModule, ThemeModule],
  declarations: [AuthComponent, LoginComponent],
})
export class AuthModule {}
