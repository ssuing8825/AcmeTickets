import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Observable } from 'rxjs';

import { onMainContentChange } from '@theme/animations/animations';
import { ThemeService } from '@theme/theme.service';

import { AuthService } from '../../../auth/auth.service';
import { SideNavService } from '../side-nav/side-nav.service';

@Component({
  selector: 'fm-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [onMainContentChange],
})
export class DefaultLayoutComponent {
  isDarkTheme$: Observable<boolean> = this._themeService.isDarkTheme$;
  public isLoggedIn$ = this._authServer.isLoggedIn$;
  public isSideNavExpanded$ = this._sideNavService.isSideNavExpanded$;
  public mainContentAnimation$ = this._sideNavService.mainContentAnimation$;
  public onSideNavChange: boolean | undefined;
  public shouldOpenSideNav$ = this._sideNavService.shouldOpenSideNav$;

  constructor(private _sideNavService: SideNavService, private _themeService: ThemeService, private _authServer: AuthService) {}
}
