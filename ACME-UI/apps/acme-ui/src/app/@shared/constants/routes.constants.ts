import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faStroopwafel, faUsers } from '@fortawesome/free-solid-svg-icons';

import { Role, RoleType } from '@shared/enums';

export interface INavItemAcl {
  role: Role;
  roleType: RoleType;
}

export class RouteItem {
  acl!: INavItemAcl;
  route?: string;
}

export class NavItem extends RouteItem {
  children?: NavItem[];
  disabled?: boolean;
  public displayName = '';
  public fontAwesomeIcon: IconDefinition = <IconDefinition>{};
  materialIcon?: string;
}

export enum RoutePath {
  Dashboard = 'dashboard',
  AdminDashboard = 'admin',
  Pages = 'pages',
  Auth = 'auth',
  Login = 'login',
  ManageUsers = 'manage-users',
  EditUserDetail = 'user-details/edit/:id',
}

export const routePermissions: RouteItem[] = [
  {
    acl: {
      role: Role.Admin,
      roleType: RoleType.fm,
    },
    route: `${RoutePath.Pages}/${RoutePath.Dashboard}/`,
  },
  // {
  //   acl: {
  //     role: Role.Admin,
  //     roleType: RoleType.fm,
  //   },
  //   route: `${RoutePath.Pages}/${RoutePath.ManageUsers}`,
  // },
];
export const sideNavMenus: NavItem[] = [
  // {
  //   displayName: 'Dashboards',
  //   fontAwesomeIcon: faHome,
  //   // route: `${RoutePath.Pages}/${RoutePath.Dashboard}/${RoutePath.RekeyDashboard}`,
  //   children: [
  //     {
  //       displayName: 'Rekey Dashboard',
  //       fontAwesomeIcon: faUserCog,
  //       route: `${RoutePath.Pages}/${RoutePath.Dashboard}/${RoutePath.RekeyDashboard}`,
  //     },
  //   ],
  // },
  // {
  //   displayName: 'Manage User',
  //   fontAwesomeIcon: faUsers,
  //   children: [],
  //   ...routePermissions[0],
  // },
  {
    displayName: 'Admin Dashboard',
    fontAwesomeIcon: faStroopwafel,
    children: [],
    ...routePermissions[0],
  },
];

export const defaultRoutesByRole = {
  fmAdmin: `${RoutePath.Pages}/${RoutePath.Dashboard}/${RoutePath.AdminDashboard}`,
};
