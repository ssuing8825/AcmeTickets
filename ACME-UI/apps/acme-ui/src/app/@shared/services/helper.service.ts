import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { format } from 'date-fns';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DownloadFileService } from '@globalLib/shared-ui';

import { appApiResources, defaultRoutesByRole } from '@shared/constants';
import { Role, RoleType } from '@shared/enums';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class HelperService {
  public env: string;

  constructor(
    private _http: HttpClient,
    private _downloadFileService: DownloadFileService,
    private _authService: AuthService,
    private _router: Router
  ) {
    this.env = environment.env;
  }

  public isDevEnv(): boolean {
    return this.env.toLocaleLowerCase() === 'dev' || this.env.toLocaleLowerCase() === 'development' ? true : false;
  }

  public isProdEnv(): boolean {
    return this.env.toLocaleLowerCase() === 'prod' || this.env.toLocaleLowerCase() === 'production' ? true : false;
  }

  public isStageEnv(): boolean {
    return this.env.toLocaleLowerCase() === 'stage' || this.env.toLocaleLowerCase() === 'staging' ? true : false;
  }

  public convertToLocalTime(utcTime: string | null): string {
    try {
      if (utcTime) {
        return format(new Date(utcTime), 'MM/dd/yyyy hh:mm:ss a');
      }
      return format(new Date(), 'MM/dd/yyyy hh:mm:ss a');
    } catch (ex) {
      throw new Error('Invalid date!');
    }
  }

  public toFormData(formValue: any): FormData {
    const formData = new FormData();
    for (const key of Object.keys(formValue)) {
      if (key == 'file') {
        for (let i = 0; i < formValue[key].length; i++) formData.append('file[]', formValue[key][i]);
      } else formData.append(key, formValue[key]);
    }
    return formData;
  }

  public getTimeElapsedInSecondsTillNow(startDate: Date) {
    const endDate = new Date();
    return (endDate.getTime() - startDate.getTime()) / 1000;
  }

  public openFile(fileId: string | null, fileType: string, isOpenAfterDownload?: boolean): Observable<void> {
    return this._http.get(`${appApiResources.file}/${fileId}`, { responseType: 'blob' as 'json' }).pipe(
      map((response: unknown) => {
        const fileBlob = response as Blob;
        const filename = fileId ?? fileType;
        this._downloadFileService.downloadFile(fileBlob, filename, isOpenAfterDownload);
      }),
      catchError((error) => {
        console.log('File download failed!', error);
        return EMPTY;
      })
    );
  }

  public redirectToDefaultPage() {
    const currentRole = this._authService.currentUserValue.currentRole;
    if (currentRole) {
      if (currentRole.roleType === RoleType.fm) {
        if (currentRole.roleName === Role.Admin) {
          this._router.navigate([defaultRoutesByRole.fmAdmin]);
        } else if (currentRole.roleName === Role.TransferAgent) {
          this._router.navigate([defaultRoutesByRole.fmAdmin]);
        } else if (currentRole.roleName === Role.OperationManager) {
          this._router.navigate([defaultRoutesByRole.fmAdmin]);
        } else if (currentRole.roleName === Role.ClientManager) {
          this._router.navigate([defaultRoutesByRole.fmAdmin]);
        }
      } else if (currentRole.roleType === RoleType.Client) {
        if (currentRole.roleName === Role.Admin || Role.AccountAdmin || Role.Staff) {
          this._router.navigate([defaultRoutesByRole.fmAdmin]);
        }
      }
    }
  }
}
