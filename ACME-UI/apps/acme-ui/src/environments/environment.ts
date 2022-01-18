// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  env: 'development',
  production: false,
  apiHost: 'https://localhost:5000/',
  listApi: 'https://eventellectdbapi.azurewebsites.net',

  itOpsSyncApi: 'https://localhost:7071',
  inventoryFunction: 'https://localhost:7074',
  eventManagement: 'https://localhost:7075',

  /**
   * Uncomment below urls only when running ui locally with backend running on Azure
   * Make sure to comment localhost urls
   */
  // itOpsSyncApi: 'https://acmeticketsitopssyncap.azurewebsites.net',
  // inventoryFunction: 'https://eventellectinventory.azurewebsites.net',
  // eventManagement: 'https://eventellectpurchase.azurewebsites.net',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
