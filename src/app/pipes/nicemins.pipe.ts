import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nicemins'
})
export class NiceminsPipe implements PipeTransform {

  transform(tm: number): string {

    if (tm === 0) {
      return '0 mns';
    }

    let str = '';

    const d = Math.floor(tm / 24 / 60);
    const h = Math.floor(tm / 60) % 24;
    const m = tm % 60;
    if (d > 0) {
      str = str.concat(`${d} day`)
    }
    if (h > 0) {
      str = str.concat(` ${h} hrs`)
    }
    if (m > 0) {
      str = str.concat(` ${m} mns`)
    }

    return str;

  }

}
