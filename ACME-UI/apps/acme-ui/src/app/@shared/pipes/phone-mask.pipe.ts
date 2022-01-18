import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fmPhoneMask',
})
export class PhoneMaskPipe implements PipeTransform {
  transform(phone: string): string {
    if (phone) {
      const value = phone.replace(/[^0-9]/g, '');
      const newPhone = '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 10);
      return newPhone;
    }

    return phone;
  }
}
