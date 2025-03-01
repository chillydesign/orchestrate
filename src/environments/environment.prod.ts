import { LANG_FR_TRANS } from '../app/translate/lang-fr';

export const environment = {
  production: true,
  site_name: `Orchestrate`,
  api_url: 'https://webfactor.ch/orchestrate_api',
  front_url: 'https://webfactor.ch/orchestrate/',
  secure_cookie: true,
  cookie_name: 'token_prod_orch',
  cookie_domains: ['webfactor.ch'],
  cookie_length_hours: 8760,
  cache_duration: 60000, // time to hold resources from API in cache in milliseconds
  translations: LANG_FR_TRANS,
  hourly_wage: 55,

};
