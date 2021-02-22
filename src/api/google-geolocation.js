const has = require('lodash/has');
const Base = require('./base');

const API = 'https://www.googleapis.com/geolocation/v1/geolocate';

/* eslint-disable class-methods-use-this */
class GoogleGeolocation extends Base {
  constructor(options) {
    super(options);
    if (options) {
      this.key = options.key;
    }
  }

  getRequestSettings({
    cellId,
    locationAreaCode,
    mobileCountryCode,
    mobileNetworkCode,
    signalStrength,
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
          ...(signalStrength && { signalStrength }),
        }],
      },
    };
  }

  validate(body) {
    return !has(body, 'error');
  }

  parseLocation(body) {
    return {
      longitude: body.location.lng,
      latitude: body.location.lat,
      accuracy: body.accuracy,
    };
  }

  parseError(body) {
    return has(body, 'error') ? body.error.errors[0].reason : body;
  }
}

module.exports = GoogleGeolocation;
