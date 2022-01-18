import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, Type } from '@angular/core';
import { Router } from '@angular/router';

import { appApiResources } from '@shared/constants';
import { HelperService } from '@shared/services';
import { IUser } from '@shared/typings';

import { ParsedError } from '../interceptors/parsed-error.interface';

@Injectable()
export class ErrorLoggerService {
  constructor(private _injector: Injector, private _http: HttpClient) {}

  // eslint-disable-next-line max-lines-per-function
  public addContextInfo(error: Error): ParsedError {
    // All the context details that you want (usually coming from other services; Constants, UserService...)
    const errorName: string | null = error.name || null;
    const appId = '';
    const userLs: string | null = localStorage.getItem('user');
    let user: IUser = {
      id: '',
      firstName: '',
      lastName: '',
      userName: '',
      roles: null,
      email: '',
    };
    if (userLs) {
      user = JSON.parse(userLs) as IUser;
    }
    const { id, userName, firstName } = user || {
      id: '',
      firstName: '',
      lastName: '',
      userName: '',
      roles: null,
      email: '',
    };
    const timeInEpochMilliseconds = Date.now();

    const router = this._injector.get(Router as Type<Router>);
    const angularRoute = router.url;

    const message: string = error.message || error.toString();
    const stackFrames = JSON.stringify(error.stack);

    return {
      errorName,
      appId,
      firstName,
      userName,
      id,
      timeInEpochMilliseconds,
      angularRoute,
      message,
      stackFrames,
      // parsedStackInfo,
      originalErrorStack: JSON.stringify(error.stack),
    };
  }

  public async log(error: Error): Promise<ParsedError> {
    // const parsedStackInfo = await this.parseErrorStack(error);
    const parsedError = this.addContextInfo(error);

    this.logToConsole(error);

    if (appApiResources.logError) {
      // Send error to server
      await this._http.post<ParsedError>(appApiResources.logError, parsedError).toPromise();
      return parsedError;
    }
    // API to log error not available
    await new Promise<ParsedError>((resolve) => {
      setTimeout(() => {
        resolve(parsedError);
      }, 0);
    });
    return parsedError;
  }

  private logToConsole(error: Error) {
    const helperService = this._injector.get(HelperService as Type<HelperService>);
    if (helperService.isDevEnv()) {
      console.error('🚧 ', error);
      // console.error('🚀 ~ file: error-logger.service.ts ~ line 79 ~ ErrorLoggerService ~ logToConsole ~ Parsed Error: ', parsedError);
    } else {
      console.log(error);
    }
  }
}
