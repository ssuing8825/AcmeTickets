import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { INavItemAcl } from '@shared/constants';

import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private _router: Router, private _authService: AuthService) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this._authService.currentUserValue;
    if (user && user.token) {
      const currentRole = user.currentRole;
      const routeData = route.data;
      if (currentRole && routeData && routeData.allowedRoles && routeData.allowedRoles.length > 0) {
        const routeAcl = routeData.allowedRoles as INavItemAcl[];
        const matchedRole = routeAcl.find((acl) => acl.role === currentRole.roleName && acl.roleType === currentRole.roleType);
        if (matchedRole) {
          return true;
        }
        this._router.navigate(['/']);
        return false;
      }
      return true;
    }
    this._authService.logout(state.url);
    return false;
  }
}
