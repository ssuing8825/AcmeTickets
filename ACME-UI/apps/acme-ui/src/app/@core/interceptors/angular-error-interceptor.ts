import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector, Type } from '@angular/core';

import { HotToastService } from '@ngneat/hot-toast';

import { ErrorLoggerService } from '@core/utils/error-logger.service';

import { appConstants } from '@shared/constants/app.constant';
import { AppError } from '@shared/typings/app-error.interface';

@Injectable()
export class AngularErrorInterceptor implements ErrorHandler {
  constructor(
    // Because the ErrorHandler is created before the providers, we'll have to use the Injector to get them.
    private _injector: Injector
  ) {}

  public handleError(error: Error | HttpErrorResponse): void {
    if (error instanceof HttpErrorResponse) {
      // do nothing as we are handling http errors in http interceptor
    } else {
      // Handle Client Error (Angular Error, ReferenceError...)
      const errorsService = this._injector.get(ErrorLoggerService as Type<ErrorLoggerService>);

      void errorsService.log(error).then(() => this.showToast(appConstants.defaultJavaScriptError));
      // throw error;
    }
  }

  private showToast(error: AppError): void {
    const toast = this._injector.get(HotToastService as Type<HotToastService>);
    toast.error(`${error.error}! ${error.message}`);
  }
}
