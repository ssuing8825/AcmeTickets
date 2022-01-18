import { IServerResponse } from '@acme/shared-ui';

import { IRole } from './role.interface';

export interface IUser {
  id: string;
  firstName: string | null;
  middleName?: string | null;
  userName: string | null;
  lastName: string | null;
  fullName?: string | null;
  email: string | null;
  phoneNumber?: string | null;
  createdOn?: Date | null;
  picture?: Picture | null;
  currentRole?: IRole | null;
  roles?: IRole[] | null;
  token?: string;
  idToken?: string;
  isEnabled?: boolean | null;
}

export interface Picture {
  large: string;
  medium: string;
  thumbnail: string;
}

export interface ILoginServerResponse extends IServerResponse {
  data: IUser;
}
