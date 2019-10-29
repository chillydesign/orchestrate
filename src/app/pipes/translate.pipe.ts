import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';
@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  private t = environment.translations;

  transform(value: any): any {
    if (this.t[value]) {
      return this.t[value];
    } else {
      return value;
    }

  }

}
