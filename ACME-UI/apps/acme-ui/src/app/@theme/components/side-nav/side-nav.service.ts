import { Injectable } from '@angular/core';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { appConstants } from '@shared/constants/app.constant';

@Injectable({
  providedIn: 'root',
})
export class SideNavService {
  // With this subject you can save the sidenav state and consumed later into other pages.
  private _isSideNavExpandedAction = new BehaviorSubject<boolean>(appConstants.sideNav.isSideNavInitialExpandedState);
  private _shouldOpenSideNavAction = new BehaviorSubject<boolean>(appConstants.sideNav.shouldOpenSideNavInitialState);
  private _showNavItemTitleAction = new BehaviorSubject<boolean>(appConstants.sideNav.showSideNavTitleInitialState);

  public isSideNavExpanded$ = this._isSideNavExpandedAction.asObservable();
  public showNavItemTitle$ = this._showNavItemTitleAction.asObservable();
  public shouldOpenSideNav$ = this._shouldOpenSideNavAction.asObservable();

  public mainContentAnimation$ = combineLatest([this.isSideNavExpanded$, this.shouldOpenSideNav$]).pipe(
    map(([isSideNavExpanded, isSideNavOpen]) => {
      return isSideNavExpanded && isSideNavOpen ? appConstants.sideNav.openAnimation : appConstants.sideNav.closeAnimation;
    })
  );

  toggleSideNavSize() {
    const newExpandedState = !this._isSideNavExpandedAction.value;
    this._isSideNavExpandedAction.next(newExpandedState);
    this._showNavItemTitleAction.next(newExpandedState);
  }

  public toggleSideNavVisibility() {
    const currentVisibility = this._shouldOpenSideNavAction.value;
    this._shouldOpenSideNavAction.next(!currentVisibility);
  }

  public toggleSideNavVisibilityManually(visible: boolean) {
    this._shouldOpenSideNavAction.next(visible);
  }
}
