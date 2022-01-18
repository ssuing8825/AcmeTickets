import { Pipe, PipeTransform } from '@angular/core';

import { Role, RoleType } from '@shared/enums';
import { IUser } from '@shared/typings';

@Pipe({
  name: 'sideNavMenuByRole',
})
export class SideNavMenuByRolePipe implements PipeTransform {
  transform(menuForRole: Role, menuForRoleType: RoleType, loggedInUser: IUser | null | undefined): boolean {
    if (loggedInUser && loggedInUser.currentRole) {
      const currentUserRole = loggedInUser.currentRole;
      if (menuForRole === currentUserRole.roleName && menuForRoleType === currentUserRole.roleType) {
        return true;
      }
      return false;
    }
    return false;
  }
}
