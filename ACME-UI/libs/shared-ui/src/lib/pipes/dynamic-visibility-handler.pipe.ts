/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'globalLibDynamicVisibilityHandler',
})
export class DynamicVisibilityHandlerPipe implements PipeTransform {
  transform(value: (rowData: any, args?: any[]) => boolean, rowData: any, args?: any[]): boolean {
    return value(rowData, args);
  }
}
