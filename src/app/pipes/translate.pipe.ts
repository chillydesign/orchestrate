import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';
@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  private t = environment.translations;



  transform(value: any): any {

    console.log(environment.translations);


    if (this.t[value]) {
      return this.t[value];
    } else {
      return value;
    }

  }

}
