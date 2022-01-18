import { Pipe, PipeTransform } from '@angular/core';

import { Claim, ClaimType } from '@shared/enums';

import { AuthService } from '../../auth/auth.service';

@Pipe({
  name: 'fmAclValidation',
})
export class AclValidation implements PipeTransform {
  constructor(private _authService: AuthService) {}
  transform(entity: Claim, action: ClaimType): boolean {
    try {
      if (!entity) {
        throw new Error('Claim is required');
      }
      if (!action) {
        throw new Error('ClaimType is required');
      }
      const claimByClaimType = this.getCurrentRoleClaims();
      if (claimByClaimType && claimByClaimType[entity]) {
        return claimByClaimType[entity][action] ?? false;
      }
    } catch (error) {
      return false;
    }
    return false;
  }

  getCurrentRoleClaims(): Record<Claim, Record<ClaimType, boolean>> | null {
    const loggedInUser = this._authService.currentUserValue;
    try {
      if (loggedInUser && loggedInUser.currentRole && loggedInUser.currentRole.claims && loggedInUser.currentRole.claims.length > 0) {
        return loggedInUser.currentRole.claimByClaimType ?? null;
      }
      throw new Error('LoggedIn user info is required');
    } catch (error) {
      return null;
    }
  }
}
