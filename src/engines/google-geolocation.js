const _ = require('lodash');
const Base = require('./base');

const API = 'https://www.googleapis.com/geolocation/v1/geolocate';

class GoogleGeolocation extends Base {
  constructor(options) {
    super();
    if (options) {
      this.key = options.key;
    }
  }

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

  validate(body) {
    return !_.has(body, 'error');
  }

  parseLocation(body) {
    return {
      longitude: body.location.lng,
      latitude: body.location.lat,
      accuracy: body.accuracy,
    };
  }

  parseError(body) {
    return _.has(body, 'error') ? body.error.errors[0].reason : body;
  }
}

//  Exports
module.exports = GoogleGeolocation;
