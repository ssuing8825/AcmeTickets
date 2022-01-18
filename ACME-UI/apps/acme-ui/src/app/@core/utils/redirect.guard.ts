import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { HelperService } from '@shared/services';

import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RedirectGuard implements CanActivate {
  constructor(private _router: Router, private _authService: AuthService, private _helperService: HelperService) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this._authService.currentUserValue;
    if (user && user.token) {
      this._helperService.redirectToDefaultPage();
      return true;
    }
    this._authService.logout(state.url);
    return false;
  }
}
