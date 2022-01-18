import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { HotToastService } from '@ngneat/hot-toast';

import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

import { defaultRoutesByRole } from '@shared/constants';
import { appConstants } from '@shared/constants/app.constant';
import { HelperService } from '@shared/services';
import { IUser } from '@shared/typings';

import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

@Component({
  selector: 'fm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class LoginComponent implements OnDestroy {
  public hide = true;
  public authSubscription!: Subscription;
  public loginErrorMessage = '';
  public loginFailed = false;
  public loader!: boolean;

  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });
  public returnUrl = '';

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private _helperService: HelperService,
    private cookieService: CookieService,
    private _toast: HotToastService
  ) {}

  public get password() {
    return this.loginForm.get('password');
  }

  public get email() {
    return this.loginForm.get('email');
  }

  onLogin(): void {
    console.log('TODO');
    this.authSubscription = this._authService.loginUser(this.email?.value, this.password?.value, '', '', true).subscribe((res) => {
      console.log(res);
      // this._router.navigate([defaultRoutesByRole.fmAdmin]);
      window.location.assign('/');
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
