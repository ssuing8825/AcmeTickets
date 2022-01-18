/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { NavItem, sideNavMenus } from '@shared/constants/routes.constants';
import { HelperService } from '@shared/services';
import { IUser } from '@shared/typings';

import { animateText, onSideNavChange, resizeAvatarOnSideNavCollapseExpand } from '@theme/animations/animations';

import { AuthService } from '../../../auth/auth.service';

import { SideNavService } from './side-nav.service';

@Component({
  selector: 'fm-sidebar',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [onSideNavChange, animateText, resizeAvatarOnSideNavCollapseExpand],
})
export class SideNavComponent {
  private _sideNavMenusSubject = new BehaviorSubject<NavItem[]>(sideNavMenus);
  public collapse = true;
  public sideNavMenusAction$ = this._sideNavMenusSubject.asObservable();
  public isSideNavExpanded$ = this._sidebarService.isSideNavExpanded$;
  public linkText = false;
  public showNavItemTitle$ = this._sidebarService.showNavItemTitle$;
  public sideNavMenus = sideNavMenus;
  public sideNavState = false;
  public loggedInUser$ = this._authService.loggedInUser$;

  // Combine the streams for the view
  public vm$ = combineLatest([this.isSideNavExpanded$, this.showNavItemTitle$, this.loggedInUser$, this.sideNavMenusAction$]).pipe(
    map(([isSideNavExpanded, showNavItemTitle, loggedInUser, sideNavMenus]) => ({
      isSideNavExpanded,
      showNavItemTitle,
      loggedInUser,
      sideNavMenus,
    }))
  );

  constructor(private _sidebarService: SideNavService, private _authService: AuthService, private _helperService: HelperService) {}

  public onSideNavSizeToggle() {
    this._sidebarService.toggleSideNavSize();
  }

  public onRoleChanged($event: MatSelectChange, loggedInUser: IUser) {
    const roles = loggedInUser.roles;
    if (roles && roles.length > 0) {
      const roleId = $event.value;
      loggedInUser.currentRole = roles.find((role) => role.roleId === roleId);
      this._authService.currentUserValue = { ...loggedInUser };
      this._helperService.redirectToDefaultPage();
    }
  }

  public onBusinessUnitChanged($event: MatSelectChange, loggedInUser: IUser) {
    // const businessUnitList = loggedInUser.businessUnitList;
    // if (businessUnitList && businessUnitList.length > 0) {
    //   const selectedBusinessUnitId = $event.value;
    //   loggedInUser.businessUnitId = businessUnitList.find((x) => x.businessUnitId == selectedBusinessUnitId)?.businessUnitId;
    //   this._authService.currentUserValue = { ...loggedInUser };
    //   this._sideNavMenusSubject.next([]);
    //   setTimeout(() => {
    //     this._sideNavMenusSubject.next(sideNavMenus);
    //   }, 0);
    //   this._helperService.redirectToDefaultPage();
    // }
  }

  public selectedItem(event: unknown) {
    // console.log(event);
  }
}
