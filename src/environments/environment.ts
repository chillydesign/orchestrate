// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { LANG_FR_TRANS } from '../app/translate/lang-fr';
// import { LANG_EN_TRANS } from '../app/translate/lang-en';


export const environment = {
  production: false,
  site_name: `Orchestrate`,
  api_url: 'http://localhost/orchestrate_api',
  // api_url: 'https://webfactor.ch/orchestrate_api',
  front_url: 'http://localhost:1234/',
  secure_cookie: false,
  cookie_name: 'token_local_orch',
  cookie_domains: ['localhost'],
  cookie_length_hours: 50,
  cache_duration: 60000, // time to hold resources from API in cache in milliseconds
  translations: LANG_FR_TRANS
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
