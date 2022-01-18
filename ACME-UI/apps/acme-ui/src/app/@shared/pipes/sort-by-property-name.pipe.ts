import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy',
})
export class SortByPropertyNamePipe implements PipeTransform {
  transform(value: any[], propertyName: string): any[] {
    if (propertyName && value)
      return value.sort((firstObject: any, secondObject: any) => firstObject[propertyName].localeCompare(secondObject[propertyName]));
    return value;
  }
}
