import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { Observable } from 'rxjs';

import { appConstants } from '@shared/constants/app.constant';

import { ThemeService } from '@theme/theme.service';

import { AuthService } from '../../../auth/auth.service';
import { SideNavService } from '../side-nav/side-nav.service';

@Component({
  selector: 'fm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  public collapse = true;
  isDarkTheme$: Observable<boolean> = this._themeService.isDarkTheme$;
  public isLoggedIn$ = this._authService.isLoggedIn$;
  @Input() public shouldOpenSideNav = appConstants.sideNav.shouldOpenSideNavInitialState;
  @Input() public sidenav: MatSidenav | undefined;
  public notificationCount = 2;

  /**
   *
   */
  constructor(private _themeService: ThemeService, private _authService: AuthService, private _sideNavService: SideNavService) {}

  public toggleDarkTheme(checked: boolean) {
    this._themeService.setDarkTheme(checked);
  }

  public toggleSideNavVisibility() {
    this._sideNavService.toggleSideNavVisibility();
  }

  public logout() {
    this._authService.logout();
  }
}
