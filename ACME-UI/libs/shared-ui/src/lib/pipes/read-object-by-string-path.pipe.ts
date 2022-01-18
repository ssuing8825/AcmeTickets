import { Pipe, PipeTransform } from '@angular/core';

import { get } from 'lodash-es';

/**
 *  Use this pipe to safely traverse the nested object or array
 *  Provide the source object or array, path to the property and default value if nothing found on that path
 *  Example Paths: 'addresses[0].city' or 'name.firstName'
 *
 *  !Warning: use this pipe only when you don't have alternative but to traverse object dynamically.
 *  Traversing objects using string path is not is not recommended as you looses the type intellisense.
 */
@Pipe({
  name: 'globalLibReadObjectByStringPath',
})
export class ReadObjectByStringPathPipe implements PipeTransform {
  public transform(value: Record<string, unknown> | unknown[], path: string, defaultValue?: unknown): unknown {
    if (!value) {
      console.error('Source object not provided!');
      return undefined;
    } else if (!path) {
      console.error('Object path to traverse not provided!');
      return undefined;
    }
    const val = get(value, path, defaultValue ?? undefined);
    return val;
  }
}
