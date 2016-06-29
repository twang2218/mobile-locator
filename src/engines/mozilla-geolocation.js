import GoogleGeolocation from './google-geolocation';

const API = 'https://location.services.mozilla.com/v1/geolocate';

export default class MozillaGeolocation extends GoogleGeolocation {
  getRequestSettings(cell) {
    return {
      method: 'POST',
      uri: API,
      qs: {
        key: this.key,
      },
      json: {
        considerIp: false,
        cellTowers: [{
          cellId: cell.cid,
          locationAreaCode: cell.lac,
          mobileCountryCode: cell.mcc,
          mobileNetworkCode: cell.mnc,
        }],
      },
    };
  }
}
