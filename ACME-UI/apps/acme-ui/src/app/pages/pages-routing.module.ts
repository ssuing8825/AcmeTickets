import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RedirectGuard } from '@core/utils';
import { AuthGuard } from '@core/utils/auth.guard';

import { INavItemAcl, RoutePath } from '@shared/constants/routes.constants';
import { Role, RoleType } from '@shared/enums';

import { PagesComponent } from 'pages/pages.component';

export const pagesRoutes: Routes = [
  {
    component: PagesComponent,
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '', pathMatch: 'full', canActivate: [RedirectGuard] },
      {
        loadChildren: () => import('pages/dashboard').then((me) => me.DashboardModule),
        path: RoutePath.Dashboard,
        data: { allowedRoles: [{ role: Role.Admin, roleType: RoleType.fm }] as INavItemAcl[] },
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pagesRoutes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
