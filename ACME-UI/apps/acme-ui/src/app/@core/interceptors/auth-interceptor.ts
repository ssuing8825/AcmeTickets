/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { AuthService } from '../../auth/auth.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   *
   */
  constructor(private _authService: AuthService, private _router: Router) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line max-lines-per-function
  public intercept(req: HttpRequest<never>, next: HttpHandler): Observable<HttpEvent<any>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let successResponse: HttpResponse<any>;
    let errorResponse: HttpErrorResponse;
    const reqUpdate = this.getHeadersWithToken(req);

    // Clone the request and replace the original
    return next.handle(req.clone(reqUpdate)).pipe(
      tap(
        // Succeeds when there is a response; ignore other events
        (event) => {
          if (event instanceof HttpResponse) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            successResponse = event;
          }
        },
        // Operation failed; error is an HttpErrorResponse
        (error) => {
          if (error instanceof HttpErrorResponse) {
            errorResponse = error;
          }
        }
      ),
      // Handle auth errors
      finalize(() => {
        this.handleAuthError(errorResponse);
      })
    );
  }

  private getHeadersWithToken(req: HttpRequest<never>) {
    // const isRequestToAuthAPI = !!(req.url.includes('/login') || req.url.includes('/register'));
    const isUserLoggedIn: boolean = this._authService.isLoggedIn;
    // const addTokenToReq = !isRequestToAuthAPI && isUserLoggedIn;
    const addTokenToReq = isUserLoggedIn;
    const headers = this.setHeaders(addTokenToReq, req);
    return addTokenToReq ? { headers } : {};
  }

  private handleAuthError(errorResponse: HttpErrorResponse) {
    const isAuthError = errorResponse && !!(errorResponse.status === 401 || errorResponse.status === 403);
    if (isAuthError) {
      this._authService.logout();
    }
  }
  private setHeaders(addTokenToReq: boolean, req: HttpRequest<never>): HttpHeaders {
    const userLocalStorage: any = this._authService.currentUserValue;
    const tokenLs = userLocalStorage?.token;
    const token = addTokenToReq ? tokenLs ?? '' : '';
    const idTokenLs = userLocalStorage?.idToken;
    const idToken = addTokenToReq ? idTokenLs ?? '' : '';
    const headers: HttpHeaders = addTokenToReq
      ? req.headers
          .set('Authorization', `Bearer ${token}`)
          .set('x-current-role', addTokenToReq ? this._authService.currentUserValue.currentRole?.roleName ?? '' : '')
          .set('x-current-role-type', addTokenToReq ? this._authService.currentUserValue.currentRole?.roleType ?? '' : '')
          .set('x-transaction-id', UUID.UUID())
          .set('IdToken', idToken)
      : req.headers;
    return headers;
  }
}
