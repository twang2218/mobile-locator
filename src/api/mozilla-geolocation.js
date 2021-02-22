const GoogleGeolocation = require('./google-geolocation');

const API = 'https://location.services.mozilla.com/v1/geolocate';

class MozillaGeolocation extends GoogleGeolocation {
  getRequestSettings({
    cellId,
    locationAreaCode,
    mobileCountryCode,
    mobileNetworkCode,
    signalStrength,
    accessTechnology,
  }) {
    return {
      method: 'POST',
      uri: API,
      qs: {
        key: this.key,
      },
      json: {
        considerIp: false,
        cellTowers: [{
          cellId,
          locationAreaCode,
          mobileCountryCode,
          mobileNetworkCode,
          ...(accessTechnology && { radioType: accessTechnology }),
          ...(signalStrength && { signalStrength }),
        }],
      },
    };
  }
}

module.exports = MozillaGeolocation;
