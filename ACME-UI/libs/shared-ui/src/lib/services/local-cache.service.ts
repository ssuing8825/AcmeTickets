import { Injectable } from '@angular/core';

import { fromEvent, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LocalCacheService {
  onLocalStorageEvent$<T>(storageKey: string): Observable<T> {
    console.log('sp: 1 onLocalStorageEvent$');
    return fromEvent<StorageEvent>(window, 'storage').pipe(
      // listen to our storage key
      filter((event) => {
        return event.key === storageKey;
      }),
      filter((event) => event.newValue !== null && event.newValue !== event.oldValue),
      // deserialize the stored actions
      // get the last stored action from the actions array
      map((event) => JSON.parse(event.newValue ?? '') as T)
    );
  }
}
