import { Injectable } from '@angular/core';
import { LANG_EN_TRANS } from '../translate/lang-en';
import { LANG_FR_TRANS } from '../translate/lang-fr';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  public dictionaries = {
    en: LANG_EN_TRANS,
    fr: LANG_FR_TRANS,
  }
  public language: string;
  private local_storage_key = 'orch_cur_lan;'

  constructor() {
    this.setLanguageOnLoad();
  }


  setLanguageOnLoad(): void {
    const savio_cur_lan = localStorage.getItem(this.local_storage_key);
    if (savio_cur_lan) {
      this.setLanguage(savio_cur_lan);
    } else {
      this.setLanguage('fr');
    }

  }

  setLanguage(lang: string) {
    this.language = lang;
    localStorage.setItem(this.local_storage_key, this.language);
  }

  translate(key: string): string {


    if (this.dictionaries[this.language].hasOwnProperty(key)) {
      return this.dictionaries[this.language][key];
    } else if (this.dictionaries.fr.hasOwnProperty(key)) {
      return this.dictionaries.fr[key];
      // return '!!!' + this.dictionaries.fr[key] + '!!!';
    } else {
      return key;
      // return '!!!' + key + '!!!';
    }
  }


}
