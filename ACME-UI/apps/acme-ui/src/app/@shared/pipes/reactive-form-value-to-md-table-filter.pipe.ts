import { Pipe, PipeTransform } from '@angular/core';

import { flattenDeep } from 'lodash-es';

import { IGlobalLibTableFilters } from '@globalLib/shared-ui';

@Pipe({
  name: 'fmReactiveFormValueToMdTableFilter',
})
export class ReactiveFormValueToMdTableFilterPipe implements PipeTransform {
  transform(reactiveFormValue: { [s: string]: unknown }, tableFilters: IGlobalLibTableFilters): IGlobalLibTableFilters {
    let columnFilters = { ...tableFilters.columnFilters };
    // eslint-disable-next-line no-prototype-builtins
    if (reactiveFormValue.hasOwnProperty('status')) {
      reactiveFormValue.status = flattenDeep(reactiveFormValue.status as []);
    }
    for (const filterColumnName in reactiveFormValue) {
      let value = reactiveFormValue[filterColumnName];
      if (typeof value === 'string' && value.length === 0) {
        value = null;
      }
      columnFilters = { ...columnFilters, [filterColumnName]: value };
    }
    return { ...tableFilters, columnFilters, pageNumber: 1 };
  }
}
