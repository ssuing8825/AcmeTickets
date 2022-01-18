import { Pipe, PipeTransform } from '@angular/core';

import { ITableColumConfig } from '../typings';

@Pipe({
  name: 'globalLibTableDisplayColumnNames',
})
export class TableDisplayColumnNamesPipe implements PipeTransform {
  transform(value: ITableColumConfig[]): string[] {
    return value.map((column) => column?.propertyName || '');
  }
}
