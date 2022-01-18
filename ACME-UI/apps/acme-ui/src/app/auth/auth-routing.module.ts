import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoutePath } from '@shared/constants/routes.constants';

import { ThemeModule } from '@theme/theme.module';

import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: RoutePath.Login,
        component: LoginComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), ThemeModule],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
