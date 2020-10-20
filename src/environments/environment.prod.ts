// const portalRest = 'https://dev-itwa-portal-whereapp.whereapp.it:9443/rest' // Macchina deployata su 113 usando DNS
// const portalRest = 'https://dev-portal.italert-alfa.it:9444/rest'
const portalRest = 'https://dev-portal-cap.italert-alfa.it:9444/capgen'
// const portalRest = 'https://coll-aws-be-messages.app24pa.it/itwa/be-messages' // Macchina AWS

export const environment = {
  production: true,
  //baseUrl: `${location.protocol}//${portalRest}`
  baseUrl: `${portalRest}`,
  version: "4.0.0"
};

