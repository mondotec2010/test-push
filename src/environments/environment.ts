// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// const portalRest = '172.16.0.111/rest';

// const portalRest = '172.16.222.142:9081/itwa/be-messages' // Macchina di Fabio
// const portalRest = '172.16.0.113:9081/itwa/be-messages' // Macchina deployata
// const portalRest = 'https://dev-itwa-portal-italert.whereapp.it:9443/rest'
// const portalRest = 'https://coll-aws-be-messages.app24pa.it/itwa/be-messages' // Macchina AWS
// const portalRest = 'https://dev-portal.italert-alfa.it:9444/rest'
const portalRest = 'https://dev-portal-cap.italert-alfa.it:9444/capgen'
// const portalRestCap = 'https://dev-portal.italert-alfa.it:9444/capgen'

// const portalRest = 'http://172.16.0.113:9081/itwa/be-messages' // Macchina deployata full URL
// const portalRest = 'https://dev-itwa-portal-whereapp.whereapp.it:9443/rest' // Macchina deployata usando DNS

// const portalRest = 'localhost:9084';

export const environment = {
  production: false,
  // baseUrl: `${location.protocol}//${portalRest}`
  baseUrl: `${portalRest}`,
  version: "4.0.0"
};

/* export const environmentCap = {
  production: false,
  //baseUrl: `${location.protocol}//${portalRest}`
  baseCapUrl: `${portalRestCap}`,
  version: "4.0.0"
}; */

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
