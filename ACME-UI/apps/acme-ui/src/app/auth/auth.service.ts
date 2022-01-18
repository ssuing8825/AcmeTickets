import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { appApiResources, appConstants } from '@shared/constants';
import { Claim, ClaimType, Role, RoleType } from '@shared/enums';
import { IClaim, ILoginServerResponse, IRole, IUser } from '@shared/typings';

import { SideNavService } from '@theme/components/side-nav/side-nav.service';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _currentUserSubject: BehaviorSubject<IUser> = new BehaviorSubject({
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    roles: null,
    userName: '',
  } as IUser);
  private _isLoggedInSubject = new BehaviorSubject(false);
  private fakeUser: IUser = {
    id: '42540c97-af33-11eb-8df2-1831bf2ad1a7',
    firstName: 'Admin',
    lastName: 'User',
    userName: 'admin',
    email: 'admin@test.com',
    isEnabled: true,
    roles: [
      {
        roleId: '1',
        roleName: Role.Admin,
        roleType: RoleType.fm,
        claims: [
          { entity: Claim.User, isAllowed: true, type: ClaimType.Get },
          { entity: Claim.User, isAllowed: true, type: ClaimType.Put },
          { entity: Claim.User, isAllowed: true, type: ClaimType.Post },
          { entity: Claim.User, isAllowed: true, type: ClaimType.Delete },
        ],
        claimByClaimType: {
          User: { Get: true, Put: true, Post: true, Delete: true },
          City: { Get: true, Put: true, Post: true, Delete: true },
        },
      },
    ],
    token: 'token',
  };

  public isLoggedIn$ = this._isLoggedInSubject.asObservable();
  public loggedInUser$ = this._currentUserSubject.asObservable();

  currentUserValueJson!: string | null;

  // estimateStatusRolePermissions = [
  //   {
  //     systemStatusName: EstimateRequestSystemStatus.RekeyedWrong,
  //     systemStatusId: '1',
  //     claims: [
  //       { entity: Claim.EstimateRequestForAdmin, type: ClaimType.Get, isAllowed: false },
  //       { entity: Claim.EstimateRequestForAdmin, type: ClaimType.Delete, isAllowed: true },
  //     ],
  //   },
  //   {
  //     systemStatusName: EstimateRequestSystemStatus.RequestedClientSupport,
  //     systemStatusId: '2',
  //     claims: [
  //       { entity: Claim.EstimateRequestForClient, type: ClaimType.Delete, isAllowed: false },
  //       { entity: Claim.EstimateRequestForClient, type: ClaimType.Get, isAllowed: true },
  //     ],
  //   },
  // ];

  // systemToRoleEstimateStatuses = [
  //   {
  //     systemStatusId: '1',
  //     systemStatusName: EstimateRequestSystemStatus.RekeyedWrong,
  //     roleStatus: EstimateStatusForDisplay.InProgress,
  //   },
  //   {
  //     systemStatusId: '2',
  //     systemStatusName: EstimateRequestSystemStatus.RequestedClientSupport,
  //     roleStatus: EstimateStatusForDisplay.InProgress,
  //   },
  // ];

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _sideNavService: SideNavService,
    private cookieService: CookieService
  ) {
    const lsUser = localStorage.getItem('currentUser');
    if (lsUser) {
      const user = (JSON.parse(lsUser) as IUser) || null;
      this._currentUserSubject.next(user);
      this.isLoggedIn = true;
    }
  }

  public get currentUserValue(): IUser {
    return this._currentUserSubject.value;
  }

  public set currentUserValue(user: IUser) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', user.token ?? '');
    localStorage.setItem('idToken', user.idToken ?? '');
    this._currentUserSubject.next(user);
  }

  public get isLoggedIn(): boolean {
    return this._isLoggedInSubject.value;
  }

  public set isLoggedIn(value: boolean) {
    this._isLoggedInSubject.next(value);
  }

  // eslint-disable-next-line max-lines-per-function
  public loginUser(email: string, password: string, accessToken: string, idToken: string, isFakeLogin?: boolean): Observable<IUser> {
    if (isFakeLogin) {
      return of(this.fakeUser).pipe(
        tap((user: IUser) => {
          user.currentRole = user.roles && user.roles.length > 0 ? user.roles[0] : null;
          this.currentUserValue = user;
          this._sideNavService.toggleSideNavVisibilityManually(true);
        })
      );
    }
    return this._http
      .get<ILoginServerResponse>(appApiResources.login, {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + accessToken).set('IdToken', idToken),
      })
      .pipe(
        map((res: { data: IUser }) => res.data as IUser),
        tap((user: IUser) => {
          if (user.roles && user.roles.length > 0) {
            this._mapClaims(user.roles);
          }
          user.currentRole = user.roles && user.roles.length > 0 ? user.roles[0] : null;
          this.currentUserValue = user;
          this._sideNavService.toggleSideNavVisibilityManually(true);
        })
      );
  }

  public clearAuthData() {
    localStorage.clear();
    this.isLoggedIn = false;
    this._currentUserSubject.next({} as IUser);
    this._sideNavService.toggleSideNavVisibilityManually(false);
  }

  public logout(returnUrl?: string) {
    this.clearAuthData();
    const returnUrlInQueryParam: NavigationExtras | undefined = returnUrl
      ? {
          queryParams: { returnUrl },
        }
      : undefined;
    this._router.navigate([appConstants.loginRoute], returnUrlInQueryParam);
  }

  private _mapClaims(roles: IRole[]) {
    for (const role of roles) {
      if (role && role.claims && role.claims.length > 0) {
        role.claimByClaimType = this._getClaimByClaimType(role.claims);
      }
    }
  }

  private _getClaimByClaimType(claims: IClaim[]) {
    const claimByClaimType = {} as Record<Claim, Record<ClaimType, boolean>>;
    for (const claim of claims) {
      const entity = claim.entity;
      const claimType = claim.type;
      const isAllowed = claim.isAllowed;
      claimByClaimType[entity] = claimByClaimType[entity] ?? ({} as Record<ClaimType, boolean>);
      claimByClaimType[entity][claimType] = isAllowed;
    }
    return claimByClaimType;
  }
}
