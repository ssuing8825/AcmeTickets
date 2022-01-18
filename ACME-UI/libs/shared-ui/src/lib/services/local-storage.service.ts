import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  storage = localStorage;
  /**
   *
   * @param key
   * @param value
   * @returns {any}
   */
  public setItem<T>(key: string, value: T): Observable<T> {
    this.storage.setItem(key, JSON.stringify(value));
    return of<T>(value);
  }

  /**
   *
   * @param key
   * @returns {any}
   */
  public getItem<T>(key: string): Observable<T> {
    const value = this.storage.getItem(key) ?? '';
    return of<T>(value ? JSON.parse(value) : ({} as T));
  }

  /**
   *
   * @param key
   * @returns {any}
   */
  public removeItem(key: string): Observable<void> {
    return of(this.storage.removeItem(key));
  }
}
