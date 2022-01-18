import { Claim, ClaimType, Role, RoleType } from '@shared/enums';

import { ServerResponse } from './';

export interface IRole {
  roleId: string;
  roleName: Role;
  roleType: RoleType;
  claims: IClaim[];
  claimByClaimType?: Record<Claim, Record<ClaimType, boolean>>;
}

export interface IClaim {
  entity: Claim;
  type: ClaimType;
  isAllowed: boolean;
}

export interface IRoleServerResponse extends ServerResponse {
  data: IRole[];
}
