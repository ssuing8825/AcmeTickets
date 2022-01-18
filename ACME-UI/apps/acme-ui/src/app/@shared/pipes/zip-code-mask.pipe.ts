import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zipCodeMask',
  pure: true,
})
export class ZipCodeMaskPipe implements PipeTransform {
  // eslint-disable-next-line max-lines-per-function
  transform(zipValue: string) {
    if (zipValue != null && zipValue != '') {
      switch (zipValue.length) {
        case 1: {
          if (zipValue.includes('-')) {
            zipValue = '';
          } else {
            zipValue;
          }
          break;
        }
        case 2: {
          break;
        }
        case 3: {
          break;
        }
        case 4: {
          break;
        }
        case 5: {
          break;
        }
        case 6: {
          zipValue = zipValue.substring(0, 5) + '-';
          break;
        }
        case 7: {
          break;
        }
        case 8: {
          break;
        }
        case 9: {
          break;
        }
        default: {
          break;
        }
      }
    }
    return zipValue;
  }
}
