import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';
import { TranslateService } from '../services/translate.service';
@Pipe({
  name: 'translate',
  pure: false

})
export class TranslatePipe implements PipeTransform {

  private t = environment.translations;

  constructor(private translateService: TranslateService) { }


  transform(value: any): any {

    return this.translateService.translate(value);


  }

}
