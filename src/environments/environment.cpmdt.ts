import { LANG_FR_TRANS } from '../app/translate/lang-fr';


export const environment = {
    production: true,
    site_name: `CPMDT`,
    api_url: 'https://webfactor.ch/cpmdtdev_api',
    front_url: 'https://webfactor.ch/cpmdtdev/',
    cookie_domain: 'webfactor.ch',
    cookie_length_hours: 50,
    cache_duration: 60000, // time to hold resources from API in cache in milliseconds
    translations: LANG_FR_TRANS
};
