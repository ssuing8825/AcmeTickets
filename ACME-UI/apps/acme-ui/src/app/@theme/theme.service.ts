import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { ITheme, Theme, themeColorPallet } from './theme.constants';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _darkTheme = new BehaviorSubject<boolean>(false);
  private _activeTheme = new BehaviorSubject<Theme>(Theme.Light);
  private _themeSubject = new BehaviorSubject<ITheme>(themeColorPallet);
  isDarkTheme$ = this._darkTheme.asObservable();

  activeTheme$ = this._activeTheme.asObservable();

  theme$ = this._themeSubject.asObservable();

  setDarkTheme(isDarkTheme: boolean): void {
    this._darkTheme.next(isDarkTheme);
    if (isDarkTheme) {
      this._activeTheme.next(Theme.Light);
    } else {
      this._activeTheme.next(Theme.Dark);
    }
  }
}
